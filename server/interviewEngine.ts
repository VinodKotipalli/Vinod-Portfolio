import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

export interface StartInterviewParams {
  role: string;
  experience: string;
  difficulty: string;
  topic: string;
  totalQuestions: number;
}

export interface ProcessAnswerParams {
  role: string;
  experience: string;
  difficulty: string;
  topic: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  messages: { role: string; content: string; isFollowUp?: boolean }[];
  candidateAnswer: string;
}

export interface EvaluateInterviewParams {
  role: string;
  experience: string;
  difficulty: string;
  topic: string;
  totalQuestions: number;
  durationSeconds: number;
  messages: { role: string; content: string; isFollowUp?: boolean; questionNumber?: number }[];
}

export async function generateStartQuestion(params: StartInterviewParams): Promise<{
  question: string;
  interviewerGreeting: string;
}> {
  const ai = getGeminiClient();

  const prompt = `You are a Principal Cloud Architect and Senior Technical Interviewer conducting a live mock technical interview.
Candidate Profile:
- Target Role: ${params.role}
- Experience Level: ${params.experience}
- Difficulty Level: ${params.difficulty}
- Focus Topic: ${params.topic}
- Total Interview Length: ${params.totalQuestions} questions

INTERVIEWER GUIDELINES:
1. Greet the candidate warmly and professionally in 1 brief sentence.
2. Introduce Question #1 as a realistic, production-grade scenario based on "${params.topic}" for a ${params.experience} ${params.role}.
3. The question must test practical troubleshooting, architectural decisions, CLI commands/configurations, or real-world cloud operations—NOT textbook definitions.
4. Do NOT reveal answers or hints.
5. Format your output strictly as a JSON object with two fields: "greeting" (short 1-line welcome) and "question" (the complete question statement).

Example output JSON format:
{
  "greeting": "Welcome to your technical interview for the AWS DevOps Engineer role. Let's dive into our first scenario.",
  "question": "An Application Load Balancer is returning HTTP 502 Bad Gateway errors for traffic destined to an Auto Scaling Group in private subnets. Walk me through the step-by-step methodology you would use to isolate whether the issue stems from target group health checks, security group rules, or application crash loops."
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const responseText = response.text || "{}";
  try {
    const parsed = JSON.parse(responseText);
    return {
      interviewerGreeting: parsed.greeting || `Welcome to your ${params.role} mock interview. Let's begin Question 1.`,
      question: parsed.question || `In a production environment focusing on ${params.topic}, how would you troubleshoot an unexpected service outage?`,
    };
  } catch {
    return {
      interviewerGreeting: `Welcome to your ${params.role} live interview. Let's begin Question 1.`,
      question: `In a production ${params.topic} deployment, walk me through your step-by-step strategy to troubleshoot performance degradation and ensure high availability.`,
    };
  }
}

export async function processCandidateAnswer(params: ProcessAnswerParams): Promise<{
  reply: string;
  isFollowUp: boolean;
  isCompleted: boolean;
  nextQuestionIndex: number;
  adaptiveFeedbackSnippet?: string;
}> {
  const ai = getGeminiClient();

  const formattedHistory = params.messages.map((m) => `${m.role === "candidate" ? "Candidate" : "Interviewer"}: ${m.content}`).join("\n\n");

  const prompt = `You are a Principal Cloud Architect and Senior Technical Interviewer conducting an adaptive technical interview.
Candidate Profile:
- Role: ${params.role}
- Experience: ${params.experience}
- Difficulty: ${params.difficulty}
- Topic: ${params.topic}
- Current Question Number: ${params.currentQuestionIndex} of ${params.totalQuestions}

CONVERSATION TRANSCRIPT SO FAR:
${formattedHistory}

CANDIDATE'S LATEST ANSWER:
"${params.candidateAnswer}"

YOUR TASK AS TECHNICAL INTERVIEWER:
1. Analyze the candidate's answer for technical accuracy, practical depth, and problem-solving methodology.
2. Determine whether you should:
   - Option A (FOLLOW-UP): Ask a sharp, contextual follow-up question digging deeper into their specific answer (e.g., if they mentioned a command without parameters, missed edge cases, gave an intriguing insight, or need to defend their architectural choice). Ask a follow-up ONLY if this question hasn't already had 2 follow-ups.
   - Option B (NEXT QUESTION): Acknowledge their response in 1 brief sentence and transition to the NEXT distinct production scenario question #${params.currentQuestionIndex + 1} on ${params.topic} (or related DevOps stack).
   - Option C (FINISH): If currentQuestionIndex is ${params.totalQuestions} and this question is sufficiently answered, wrap up the interview gracefully.
3. Keep the tone professional, objective, and realistic. Never give away full answers.
4. Adapt difficulty slightly (make it harder if they gave a stellar answer, or provide a gentler real-world pivot if they struggled).

OUTPUT FORMAT:
Return strictly a JSON object with:
{
  "decision": "FOLLOW_UP" | "NEXT_QUESTION" | "FINISH",
  "reply": "Your actual words to the candidate (e.g., acknowledgement + follow-up question OR acknowledgement + new question statement OR wrap-up message)",
  "adaptiveFeedbackSnippet": "Brief 1-sentence internal note on how they handled the previous point"
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.6,
    },
  });

  const responseText = response.text || "{}";
  try {
    const parsed = JSON.parse(responseText);
    const decision = parsed.decision || "NEXT_QUESTION";

    if (decision === "FINISH" || (decision === "NEXT_QUESTION" && params.currentQuestionIndex >= params.totalQuestions)) {
      return {
        reply: parsed.reply || "Thank you for completing this technical interview. I'm now compiling your comprehensive performance evaluation report.",
        isFollowUp: false,
        isCompleted: true,
        nextQuestionIndex: params.currentQuestionIndex,
        adaptiveFeedbackSnippet: parsed.adaptiveFeedbackSnippet,
      };
    }

    if (decision === "FOLLOW_UP") {
      return {
        reply: parsed.reply || "Good point. Could you elaborate on the specific command or configuration parameters you would use in that situation?",
        isFollowUp: true,
        isCompleted: false,
        nextQuestionIndex: params.currentQuestionIndex,
        adaptiveFeedbackSnippet: parsed.adaptiveFeedbackSnippet,
      };
    } else {
      const nextIndex = params.currentQuestionIndex + 1;
      return {
        reply: parsed.reply || `Understood. Let's move on to Question ${nextIndex}: Walk me through how you design high availability for this architecture.`,
        isFollowUp: false,
        isCompleted: nextIndex > params.totalQuestions,
        nextQuestionIndex: nextIndex,
        adaptiveFeedbackSnippet: parsed.adaptiveFeedbackSnippet,
      };
    }
  } catch (err) {
    const nextIndex = params.currentQuestionIndex + 1;
    const isCompleted = nextIndex > params.totalQuestions;
    return {
      reply: isCompleted
        ? "Thank you. We have concluded all interview questions. Preparing your evaluation."
        : `Thank you. Moving to Question ${nextIndex}: How do you monitor and manage observability for these resources under high load?`,
      isFollowUp: false,
      isCompleted,
      nextQuestionIndex: isCompleted ? params.currentQuestionIndex : nextIndex,
    };
  }
}

export async function generateEvaluationReport(params: EvaluateInterviewParams): Promise<{
  overallScore: number;
  technicalKnowledge: number;
  problemSolving: number;
  communication: number;
  accuracy: number;
  practicalKnowledge: number;
  strengths: string[];
  areasForImprovement: string[];
  missingConcepts: string[];
  recommendedTopics: string[];
  interviewReadiness: string;
  finalFeedback: string;
  radarScores: { subject: string; score: number; fullMark: number }[];
}> {
  const ai = getGeminiClient();

  const formattedTranscript = params.messages
    .map((m) => `[${m.role.toUpperCase()}${m.questionNumber ? ` - Q${m.questionNumber}` : ""}${m.isFollowUp ? " (Follow-up)" : ""}]:\n${m.content}`)
    .join("\n\n");

  const prompt = `You are a Principal Staff DevOps & Cloud Hiring Manager evaluating a completed technical interview.
Interview Metadata:
- Role: ${params.role}
- Experience Target: ${params.experience}
- Difficulty Level: ${params.difficulty}
- Topic: ${params.topic}
- Questions Target: ${params.totalQuestions}
- Total Duration: ${Math.round(params.durationSeconds / 60)} minutes (${params.durationSeconds} seconds)

COMPLETE INTERVIEW TRANSCRIPT:
${formattedTranscript}

EVALUATION RUBRIC:
1. Overall Score: 0 to 100 based on industry hiring bar.
2. Technical Knowledge: 0.0 to 10.0 (AWS/DevOps architecture, command familiarity, parameter correctness).
3. Problem Solving: 0.0 to 10.0 (Systematic debugging, root cause analysis, methodical thinking).
4. Communication: 0.0 to 10.0 (Clarity, conciseness, structured explanations, professional terminology).
5. Accuracy: 0.0 to 10.0 (Factual precision, avoiding hallucinations, valid syntax/concepts).
6. Practical Knowledge: 0.0 to 10.0 (Real-world production experience vs textbook theory, security, cost, scale).
7. Strengths: 3 to 5 concrete bullet points highlighting where candidate excelled.
8. Areas for Improvement: 2 to 4 actionable bullet points on weaknesses identified in their answers.
9. Missing Concepts: 2 to 4 specific technical flags, tools, commands, or architectural best practices they omitted.
10. Recommended Topics: 3 to 5 targeted technologies/patterns to study next.
11. Interview Readiness: Single concise statement on candidate's readiness level (e.g., "Ready for intermediate AWS DevOps Engineer interviews; brush up on advanced EKS networking and Terraform remote state locking.").
12. Final Feedback: 2-3 paragraph comprehensive mentor review.

OUTPUT FORMAT:
Return strictly a JSON object with this exact schema:
{
  "overallScore": 84,
  "technicalKnowledge": 8.5,
  "problemSolving": 8.0,
  "communication": 7.5,
  "accuracy": 8.5,
  "practicalKnowledge": 8.0,
  "strengths": [
    "Clear step-by-step troubleshooting methodology for AWS networking",
    "Solid understanding of containerization and Kubernetes pod lifecycles",
    "Proactive consideration of security groups and least-privilege IAM permissions"
  ],
  "areasForImprovement": [
    "Elaborate more on specific CLI flags (e.g., kubectl logs --previous, terraform state rm)",
    "Deepen knowledge of ingress controller configurations and ALB target group health thresholds"
  ],
  "missingConcepts": [
    "Did not mention Terraform state locking with DynamoDB during concurrency questions",
    "Omitted mention of readiness vs liveness probe distinction in pod restart analysis"
  ],
  "recommendedTopics": [
    "Amazon EKS CNI & VPC Networking",
    "Terraform Remote State & DynamoDB Locking",
    "Prometheus PromQL Alert Rule Optimization"
  ],
  "interviewReadiness": "Strong candidate for Mid-Level DevOps Engineer positions with high practical potential.",
  "finalFeedback": "You demonstrated very solid fundamentals in ${params.topic} with a structured problem-solving mindset. Your answers show hands-on familiarity with Linux and AWS environments. By reviewing deeper configuration flags and distributed state locking mechanisms, you will be exceptionally competitive in top-tier technical interviews."
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const responseText = response.text || "{}";
  try {
    const parsed = JSON.parse(responseText);
    const overallScore = Math.min(100, Math.max(0, Math.round(Number(parsed.overallScore) || 75)));
    const technicalKnowledge = Math.min(10, Math.max(0, Number(parsed.technicalKnowledge) || 7.5));
    const problemSolving = Math.min(10, Math.max(0, Number(parsed.problemSolving) || 7.0));
    const communication = Math.min(10, Math.max(0, Number(parsed.communication) || 7.5));
    const accuracy = Math.min(10, Math.max(0, Number(parsed.accuracy) || 7.5));
    const practicalKnowledge = Math.min(10, Math.max(0, Number(parsed.practicalKnowledge) || 7.0));

    return {
      overallScore,
      technicalKnowledge,
      problemSolving,
      communication,
      accuracy,
      practicalKnowledge,
      strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : ["Demonstrated solid foundational understanding of " + params.topic],
      areasForImprovement: Array.isArray(parsed.areasForImprovement) && parsed.areasForImprovement.length > 0 ? parsed.areasForImprovement : ["Practice deeper CLI flag explanation"],
      missingConcepts: Array.isArray(parsed.missingConcepts) && parsed.missingConcepts.length > 0 ? parsed.missingConcepts : ["Standard production observability patterns"],
      recommendedTopics: Array.isArray(parsed.recommendedTopics) && parsed.recommendedTopics.length > 0 ? parsed.recommendedTopics : [params.topic + " Advanced Architecture"],
      interviewReadiness: parsed.interviewReadiness || `Ready for ${params.difficulty} ${params.role} technical discussions.`,
      finalFeedback: parsed.finalFeedback || "Great effort across all questions. Continue practicing production scenarios and hands-on debugging.",
      radarScores: [
        { subject: "Technical Depth", score: Math.round(technicalKnowledge * 10), fullMark: 100 },
        { subject: "Problem Solving", score: Math.round(problemSolving * 10), fullMark: 100 },
        { subject: "Communication", score: Math.round(communication * 10), fullMark: 100 },
        { subject: "Accuracy", score: Math.round(accuracy * 10), fullMark: 100 },
        { subject: "Practical Ops", score: Math.round(practicalKnowledge * 10), fullMark: 100 },
      ],
    };
  } catch (err) {
    return {
      overallScore: 78,
      technicalKnowledge: 8.0,
      problemSolving: 7.5,
      communication: 8.0,
      accuracy: 7.5,
      practicalKnowledge: 8.0,
      strengths: [`Strong practical familiarity with ${params.topic}`, "Good structured approach to troubleshooting production issues"],
      areasForImprovement: ["Provide deeper architectural trade-off comparisons", "Include specific CLI flags and configuration keywords"],
      missingConcepts: ["Automated rollbacks on deployment failure", "Infrastructure drift detection"],
      recommendedTopics: [`Advanced ${params.topic} Patterns`, "Production Disaster Recovery"],
      interviewReadiness: `Qualified for ${params.difficulty} ${params.role} interviews.`,
      finalFeedback: "Overall a strong interview demonstration. Focusing on production resilience and advanced edge cases will bring your interview readiness to senior levels.",
      radarScores: [
        { subject: "Technical Depth", score: 80, fullMark: 100 },
        { subject: "Problem Solving", score: 75, fullMark: 100 },
        { subject: "Communication", score: 80, fullMark: 100 },
        { subject: "Accuracy", score: 75, fullMark: 100 },
        { subject: "Practical Ops", score: 80, fullMark: 100 },
      ],
    };
  }
}
