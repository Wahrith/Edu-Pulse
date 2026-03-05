import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./config";

export interface UserStats {
  dailyRequests: number;
  lastResetDate: string;
  studyStreak: number;
  lastActiveDate: string;
  topicsMastered: number;
}

const todayStr = () => new Date().toISOString().split("T")[0];

const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const defaults = (): UserStats => ({
  dailyRequests: 0,
  lastResetDate: todayStr(),
  studyStreak: 0,
  lastActiveDate: "",
  topicsMastered: 0,
});

export const getUserStats = async (uid: string): Promise<UserStats> => {
  const ref = doc(db, "users", uid, "stats", "overview");
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const d = defaults();
    await setDoc(ref, d);
    return d;
  }
  return snap.data() as UserStats;
};

export const recordActivity = async (uid: string): Promise<void> => {
  const ref = doc(db, "users", uid, "stats", "overview");
  const snap = await getDoc(ref);
  const today = todayStr();
  const yesterday = yesterdayStr();

  if (!snap.exists()) {
    await setDoc(ref, {
      ...defaults(),
      dailyRequests: 1,
      studyStreak: 1,
      lastActiveDate: today,
      lastResetDate: today,
    });
    return;
  }

  const data = snap.data() as UserStats;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {};

  if (data.lastResetDate !== today) {
    updates.dailyRequests = 1;
    updates.lastResetDate = today;
  } else {
    updates.dailyRequests = increment(1);
  }

  if (data.lastActiveDate !== today) {
    updates.lastActiveDate = today;
    updates.studyStreak =
      data.lastActiveDate === yesterday ? (data.studyStreak || 0) + 1 : 1;
  }

  await updateDoc(ref, updates);
};

export const recordQuizCompletion = async (
  uid: string,
  correctCount: number,
): Promise<void> => {
  if (correctCount <= 0) return;
  const ref = doc(db, "users", uid, "stats", "overview");
  await updateDoc(ref, { topicsMastered: increment(correctCount) });
};
