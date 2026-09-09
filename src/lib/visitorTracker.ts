import {
  doc,
  setDoc,
  increment,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from './firebase';

const VISITOR_ID_KEY = 'sai_portfolio_visitor_id';
const VISITOR_RECORDED_KEY = 'sai_portfolio_visitor_recorded';
const SESSION_NOTIFIED_KEY = 'sai_portfolio_session_notified';
const OWNER_EMAIL = 'saivinodkotipalli2003@gmail.com';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'v_ssr';
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId || !/^[a-zA-Z0-9_-]+$/.test(visitorId)) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return `v_${Date.now()}_temp`;
  }
}

/**
 * Checks if the currently authenticated user is the portfolio owner.
 * If so, visitor notifications to the owner's inbox are suppressed.
 */
function isOwnerSession(): boolean {
  try {
    const currentEmail = auth.currentUser?.email;
    if (currentEmail && currentEmail.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
      return true;
    }
  } catch {
    // Ignore auth inspection errors
  }
  return false;
}

/**
 * Sends an email notification to saivinodkotipalli2003@gmail.com
 * when someone views or visits the portfolio.
 */
export async function notifyOwnerOfVisit(options: {
  isUnique: boolean;
  visitorId: string;
}): Promise<void> {
  if (typeof window === 'undefined') return;

  // Suppress sending notifications if the visitor is the owner themselves
  if (isOwnerSession()) {
    return;
  }

  const payload = {
    visitorId: options.visitorId,
    isUnique: options.isUnique,
    page: window.location.href,
    referrer: document.referrer || 'Direct / Bookmark',
    userAgent: navigator.userAgent,
    timeZone: Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || 'en',
    timestamp: new Date().toISOString(),
  };

  let delivered = false;

  // 1. Dispatch via server-side multi-channel endpoint (/api/notify-visit)
  try {
    const res = await fetch('/api/notify-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      delivered = true;
    }
  } catch (err) {
    console.warn('[VISITOR NOTIFICATION] Local API endpoint notice:', err);
  }

  // 2. Direct Web Fallback via FormSubmit to saivinodkotipalli2003@gmail.com
  if (!delivered) {
    try {
      const visitType = options.isUnique ? 'Unique First-Time Visitor' : 'Returning Visitor Session';
      await fetch('https://formsubmit.co/ajax/saivinodkotipalli2003@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[Portfolio View Alert] 🚀 ${visitType} on Saivinod's Portfolio`,
          _template: 'table',
          _captcha: 'false',
          alert_type: 'Portfolio Visitor View Notification',
          visitor_type: visitType,
          visitor_id: options.visitorId,
          page_visited: payload.page,
          traffic_source_referrer: payload.referrer,
          client_timezone: payload.timeZone,
          screen_resolution: payload.screenResolution,
          device_and_browser: payload.userAgent,
          timestamp: new Date().toLocaleString(),
        }),
      });
    } catch (fallbackErr) {
      console.warn('[VISITOR NOTIFICATION] Web direct fallback notice:', fallbackErr);
    }
  }
}

/**
 * Tracks the visitor and triggers the email notification to saivinodkotipalli2003@gmail.com
 */
export async function trackUniqueVisitor(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const isRecorded = localStorage.getItem(VISITOR_RECORDED_KEY);
    const visitorId = getOrCreateVisitorId();

    if (!isRecorded) {
      // 1. Brand new unique visitor to portfolio
      const visitorDocRef = doc(db, 'visitors', visitorId);
      const statsDocRef = doc(db, 'stats', 'visitors');

      // Record in Firestore unique visitors registry
      try {
        await setDoc(visitorDocRef, {
          visitorId,
          firstVisitedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Could not record individual visitor entry:', err);
      }

      // Increment aggregate stats counter
      try {
        await setDoc(
          statsDocRef,
          {
            totalViews: increment(1),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (writeErr) {
        console.warn('Could not increment stats/visitors:', writeErr);
      }

      localStorage.setItem(VISITOR_RECORDED_KEY, 'true');
      sessionStorage.setItem(SESSION_NOTIFIED_KEY, Date.now().toString());

      // Send immediate email alert to owner
      await notifyOwnerOfVisit({ isUnique: true, visitorId });
    } else {
      // 2. Returning visitor: notify once per visiting session
      const sessionNotified = sessionStorage.getItem(SESSION_NOTIFIED_KEY);
      if (!sessionNotified) {
        sessionStorage.setItem(SESSION_NOTIFIED_KEY, Date.now().toString());
        await notifyOwnerOfVisit({ isUnique: false, visitorId });
      }
    }
  } catch (error) {
    console.error('Visitor tracking error:', error);
  }
}

/**
 * Subscribes to real-time updates for the unique visitor counter.
 */
export function subscribeToVisitorCount(
  onCountUpdate: (count: number) => void,
  onError?: (err: unknown) => void
): () => void {
  const statsDocRef = doc(db, 'stats', 'visitors');

  return onSnapshot(
    statsDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (typeof data.totalViews === 'number') {
          onCountUpdate(data.totalViews);
          return;
        }
      }
      onCountUpdate(0);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}
