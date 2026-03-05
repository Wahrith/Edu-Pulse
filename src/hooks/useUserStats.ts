import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getUserStats, type UserStats } from "../api/firebase/userStats";

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const s = await getUserStats(user.uid);
      setStats(s);
    } catch {
      // Firestore not configured — show zero state
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, refresh };
};
