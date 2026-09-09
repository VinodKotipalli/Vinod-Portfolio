import {
  doc,
  setDoc,
  increment,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

const VISITOR_ID_KEY = 'sai_portfolio_visitor_id';
const VISITOR_RECORDED_KEY = 'sai_portfolio_visitor_recorded';

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
 * Tracks a unique visitor if this client hasn't been recorded yet.
 */
export async function trackUniqueVisitor(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const isRecorded = localStorage.getItem(VISITOR_RECORDED_KEY);
    if (isRecorded) {
      return; // Already counted this unique browser
    }

    const visitorId = getOrCreateVisitorId();
    const visitorDocRef = doc(db, 'visitors', visitorId);
    const statsDocRef = doc(db, 'stats', 'visitors');

    // 1. Record visitor record
    try {
      await setDoc(visitorDocRef, {
        visitorId,
        firstVisitedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not record individual visitor entry:', err);
    }

    // 2. Atomically increment or initialize aggregate stats without requiring client read permissions
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

    // Mark as recorded in localStorage to ensure unique counting per browser
    localStorage.setItem(VISITOR_RECORDED_KEY, 'true');
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
