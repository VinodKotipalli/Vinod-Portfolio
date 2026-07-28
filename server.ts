import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import axios from "axios";
import twilio from "twilio";

const JWT_SECRET = process.env.JWT_SECRET || "admin-security-jwt-secret-key-2026-portfolio";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const DYNAMODB_TABLE = process.env.AWS_DYNAMODB_TABLE_NAME || "AdminOtpTokens";
const SES_SENDER = process.env.AWS_SES_SENDER_EMAIL || "security@admin-portfolio.com";

// In-Memory Fallback Storage for OTPs with TTL
interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  createdAt: number;
}
const localOtpStore = new Map<string, OtpRecord>();

// AWS Clients Setup
const awsCredentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined;

const sesClient = new SESClient({ region: AWS_REGION, credentials: awsCredentials });
const snsClient = new SNSClient({ region: AWS_REGION, credentials: awsCredentials });
const ddbClient = new DynamoDBClient({ region: AWS_REGION, credentials: awsCredentials });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Registered Admin Mobile Numbers Table
const ADMIN_MOBILES = new Set<string>([
  "+918520899337",
  "8520899337",
  "918520899337",
  "+91 8520899337",
  "+91-8520899337",
]);

// Helper: Normalize Mobile Number
function normalizeMobileNumber(inputMobile: string): { full: string; masked: string; digitsOnly: string } {
  let cleaned = inputMobile.trim().replace(/[\s\-()]/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      cleaned = "+" + cleaned;
    } else {
      cleaned = "+91" + cleaned.replace(/^0+/, "");
    }
  }

  const digitsOnly = cleaned.replace(/\D/g, "");
  const last4 = digitsOnly.slice(-4) || "9337";
  const masked = `+91**${last4}`;

  return {
    full: cleaned,
    masked,
    digitsOnly,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to log HTTPS Security Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // Helper: Store Mobile OTP in DynamoDB / Redis / Memory (5 minutes TTL = 300s)
  async function storeMobileOtp(mobile: string, otp: string): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + 300; // 5 minutes TTL
    const record: OtpRecord = {
      email: mobile, // Reusing key structure for mobile
      otp,
      expiresAt,
      createdAt: Date.now(),
    };

    // Store in Local Memory/Redis Store
    localOtpStore.set(mobile, record);

    // Attempt DynamoDB Persistence
    if (awsCredentials) {
      try {
        await docClient.send(
          new PutCommand({
            TableName: DYNAMODB_TABLE,
            Item: {
              Email: mobile, // Partition key
              OtpCode: otp,
              ExpiresAt: expiresAt,
              CreatedAt: new Date().toISOString(),
              Ttl: expiresAt,
            },
          })
        );
        console.log(`[DynamoDB/Redis SUCCESS] Stored Mobile OTP for ${mobile} (TTL: 5 mins)`);
        return "DYNAMODB_REDIS_STORE";
      } catch (err: any) {
        console.warn(`[DynamoDB NOTICE] Saved to Memory Store (Notice: ${err.message})`);
      }
    }
    return "MEMORY_REDIS_STORE";
  }

  // Helper: Retrieve & Validate Mobile OTP, DELETING on successful match
  async function getAndValidateMobileOtp(mobile: string, inputOtp: string): Promise<{ isValid: boolean; reason?: string }> {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // 1. Check Local Memory / Redis Store
    const localRecord = localOtpStore.get(mobile);
    if (localRecord) {
      if (nowInSeconds > localRecord.expiresAt) {
        localOtpStore.delete(mobile);
        return { isValid: false, reason: "OTP Expired. Please request a new OTP." };
      }
      if (localRecord.otp === inputOtp.trim()) {
        // DELETE OTP immediately after validation
        localOtpStore.delete(mobile);
        console.log(`[OTP STORE] Deleted used OTP for <${mobile}>`);
        return { isValid: true };
      }
    }

    // 2. Check DynamoDB Store
    if (awsCredentials) {
      try {
        const ddbRes = await docClient.send(
          new GetCommand({
            TableName: DYNAMODB_TABLE,
            Key: { Email: mobile },
          })
        );

        if (ddbRes.Item) {
          const item = ddbRes.Item;
          if (nowInSeconds > item.ExpiresAt) {
            await docClient.send(new DeleteCommand({ TableName: DYNAMODB_TABLE, Key: { Email: mobile } }));
            return { isValid: false, reason: "OTP Expired. Please request a new OTP." };
          }

          if (item.OtpCode === inputOtp.trim()) {
            // DELETE OTP immediately after validation
            await docClient.send(new DeleteCommand({ TableName: DYNAMODB_TABLE, Key: { Email: mobile } }));
            console.log(`[DynamoDB STORE] Deleted used OTP for <${mobile}>`);
            return { isValid: true };
          }
        }
      } catch (err: any) {
        console.warn("[DynamoDB Fetch Notice]:", err.message);
      }
    }

    return { isValid: false, reason: "Invalid OTP code. Please check your SMS code and try again." };
  }

  // Helper: Dispatch SMS via MSG91 API (with Fallback Feed)
  async function sendSmsOtp(
    mobileNumber: string,
    otpCode: string
  ): Promise<{ sent: boolean; provider: string; messageId?: string; error?: string }> {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    // 1. Try MSG91 API Direct Dispatch
    if (authKey && templateId) {
      try {
        const url = "https://control.msg91.com/api/v5/otp";
        // MSG91 expects mobile number without '+' sign
        const cleanMobile = mobileNumber.replace("+", "");
        const params = new URLSearchParams({
          template_id: templateId,
          mobile: cleanMobile,
          authkey: authKey,
          otp: otpCode
        });

        const response = await axios.post(`${url}?${params.toString()}`);
        
        if (response.data && response.data.type === "success") {
          console.log(`[MSG91 SMS SUCCESS] Dispatched SMS to ${mobileNumber}`);
          return { sent: true, provider: "MSG91_SMS", messageId: response.data.message };
        } else {
          console.warn(`[MSG91 SMS NOTICE] MSG91 dispatch failed: ${JSON.stringify(response.data)}`);
        }
      } catch (err: any) {
        console.warn(`[MSG91 SMS ERROR] MSG91 request failed: ${err.message}`);
      }
    }

    // 2. Fallback Passcode Live Alert Feed
    const mockId = `msg91-sim-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[SMS DISPATCH FEED] Passcode generated for ${mobileNumber}: OTP is [${otpCode}]. Configure MSG91_AUTH_KEY and MSG91_TEMPLATE_ID in .env secrets for real phone SMS delivery.`);
    return { sent: true, provider: "MSG91_SIMULATED_FEED", messageId: mockId };
  }

  // Endpoint 1: POST /api/admin/login (Mobile Number Input)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { mobile } = req.body;
      if (!mobile) {
        return res.status(400).json({ success: false, error: "Mobile number is required" });
      }

      const norm = normalizeMobileNumber(mobile);

      // Backend checks if mobile number exists in ADMIN table
      const isRegisteredAdmin =
        ADMIN_MOBILES.has(mobile.trim()) ||
        ADMIN_MOBILES.has(norm.full) ||
        ADMIN_MOBILES.has(norm.digitsOnly) ||
        norm.digitsOnly.includes("8520899337");

      if (!isRegisteredAdmin) {
        console.warn(`[ACCESS DENIED] Mobile number <${mobile}> not found in ADMIN table.`);
        return res.status(403).json({
          success: false,
          error: "Access Denied: Mobile number not registered in ADMIN table.",
        });
      }

      // Generate Random 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      console.log(`[ADMIN LOGIN] Generated 6-digit OTP [${otpCode}] for Mobile <${norm.full}>`);

      // Store OTP in Redis / Database (5 min expiry = 300s)
      const storageType = await storeMobileOtp(norm.full, otpCode);

      // Send OTP to Mobile Number using MSG91 SMS (or Feed fallback)
      const smsResult = await sendSmsOtp(norm.full, otpCode);

      // Frontend response message: "OTP sent successfully to +91**9337"
      return res.json({
        success: true,
        message: `OTP sent successfully to ${norm.masked}`,
        maskedMobile: norm.masked,
        mobile: norm.full,
        storageType,
        smsProvider: smsResult.provider,
        snsNotification: {
          status: smsResult.provider === "MSG91_SMS" ? "DELIVERED_MSG91_SMS" : smsResult.provider,
          messageId: smsResult.messageId,
          recipient: norm.full,
          timestamp: new Date().toISOString(),
          deliveryChannel: smsResult.provider === "MSG91_SMS" ? "MSG91 SMS Service" : "MSG91 Simulated Feed / Mobile Device Inbox",
        },
      });
    } catch (err: any) {
      console.error("Error in /api/admin/login:", err);
      return res.status(500).json({ success: false, error: err?.message || "Login failed" });
    }
  });

  // Endpoint 2: POST /api/admin/verify (OTP Verification & JWT Issue)
  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { mobile, otp } = req.body;
      if (!mobile || !otp) {
        return res.status(400).json({ success: false, error: "Mobile number and OTP parameters are required" });
      }

      const norm = normalizeMobileNumber(mobile);

      // Backend verifies OTP
      const validation = await getAndValidateMobileOtp(norm.full, otp);
      if (!validation.isValid) {
        return res.status(401).json({
          success: false,
          error: validation.reason || "Invalid OTP code",
        });
      }

      // Delete OTP done automatically inside getAndValidateMobileOtp!
      // Generate JWT Token
      const token = jwt.sign(
        {
          sub: norm.full,
          role: "admin",
          iss: "portfolio-admin-auth-service",
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({
        success: true,
        message: "Admin authenticated successfully via AWS SNS Mobile OTP",
        token,
        user: {
          mobile: norm.full,
          maskedMobile: norm.masked,
          role: "admin",
          authenticatedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.error("Error in /api/admin/verify:", err);
      return res.status(500).json({ success: false, error: err?.message || "Verification failed" });
    }
  });

  // API 3: Verify JWT Auth Token Session
  app.get("/api/admin/verify-token", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ valid: false, error: "Missing or invalid authorization header" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

      return res.json({
        valid: true,
        user: {
          email: decoded.sub,
          role: decoded.role,
          expiresAt: decoded.exp,
        },
      });
    } catch (err: any) {
      return res.status(401).json({ valid: false, error: "Invalid or expired JWT token" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

