import { useState, useEffect } from 'react'
import { ContestCard } from './components/contestCard'
// when importing type, i should write type before interface in typescript
import { NotificationModal, type NotificationModalType } from './components/NotificationModal'

import { Navbar } from './components/Navbar'
import { AuthModal } from './components/AuthModal'
import { useAuth } from './context/AuthContext'
import { supabase } from './lib/supabase'
import { RefreshCw } from 'lucide-react'
import type { Contest, APIResponse } from './types/contest'

// Vite access env variable using import.meta.env.VITE_VARNAME
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function App() {
  const { user } = useAuth();

  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [siteFilter, setSiteFilter] = useState<string>("ALL");
  const [modalType, setModalType] = useState<NotificationModalType | null>(null);
  const [pendingContest, setPendingContest] = useState<Contest | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [reminders, setReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("contest_reminders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifiedContests, setNotifiedContests] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("notified_contests");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/contests`);
      if (!response.ok) throw new Error("Failed to fetch contests");
      const data: APIResponse = await response.json();
      setContests(data.data || []);
    } catch (err: any) {
      setError(err.message || "Error connecting to backend");
    } finally {
      setLoading(false);
    }
  }

  // jb ui aayega pehle baar, tb yeh automatically fire hoga
  useEffect(() => {
    fetchContests();
  }, []);

  // Cloud Sync: When user logs in, fetch saved reminders from Supabase
  useEffect(() => {
    if(!user) return;

    const syncCloudReminders = async () => {
      try {
        const { data, error } = await supabase
          .from("user_reminders")
          .select("contest_id");

        if(error) {
          console.error("Error fetching cloud reminders:", error);
          return;
        }

        const cloudContestIds: string[] = data ? data.map((row) => row.contest_id) : [];

        // Merge cloud reminders with any existing local reminders
        // prevLocal take the value of reminders from the previous render cycle, property of setReminders
        setReminders((prevLocal) => {
          const merged = Array.from(new Set([...prevLocal, ...cloudContestIds]));
          localStorage.setItem("contest_reminders", JSON.stringify(merged));

          // If there were local reminders not yet in cloud, upload them
          const missingInCloud = prevLocal.filter((id) => !cloudContestIds.includes(id));
          if(missingInCloud.length > 0){
            const rowsToInsert = missingInCloud.map((contestId) => ({
              user_id: user.id,
              contest_id: contestId,
            }));
            supabase.from("user_reminders").insert(rowsToInsert).then(({error: insertErr }) =>  {
              if(insertErr) console.error("Error syncing local reminders to cloud:", insertErr);
            });
          }
          return merged;
        });
      } catch (err) {
        console.error("Error in syncCloudReminders:", err);
      }
    };

    syncCloudReminders();
  }, [user]);

  const addReminderId = async (contestId: string) => {
    setReminders((prev) => {
      if (prev.includes(contestId)) return prev;
      const updated = [...prev, contestId];
      localStorage.setItem("contest_reminders", JSON.stringify(updated));
      return updated;
    });

    // If logged in, persist to Supabase PostgreSQL table
    if (user) {
      const { error } = await supabase
        .from("user_reminders")
        .insert({
          user_id: user.id,
          contest_id: contestId,
        });
      if(error) console.error("Error saving reminder to cloud:", error);
    }
  };

  const removeReminderId = async (contestId: string) => {
    setReminders((prev) => {
      const updated = prev.filter((id) => id !== contestId);
      localStorage.setItem("contest_reminders", JSON.stringify(updated));
      return updated;
    });

    // If logged in, delete from Supabase PostgreSQL table
    if (user) {
      const { error } = await supabase
        .from("user_reminders")
        .delete()
        .eq("contest_id", contestId);
      if (error) console.error("Error removing reminder from cloud:", error);
    }
  };

  const toggleReminder = async (contest: Contest) => {
    // If already reminded, user simply wants to turn it off
    if (reminders.includes(contest.id)) {
      removeReminderId(contest.id);
      return;
    }

    // Check browser notification support
    if (!("Notification" in window)) {
      setModalType("unsupported");
      return;
    }

    // If notifications are blocked
    if (Notification.permission === "denied") {
      setModalType("blocked");
      return;
    }

    // If permission has not been asked yet, show soft pre-permission prompt
    if (Notification.permission === "default") {
      setPendingContest(contest);
      setModalType("prompt");
      return;
    }

    // If permission is already granted
    if (Notification.permission === "granted") {
      addReminderId(contest.id);
    }
  };

  const handleConfirmPrompt = async () => {
    if (!("Notification" in window)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        if (pendingContest) {
          await addReminderId(pendingContest.id);
        }
        setModalType(null);
        setPendingContest(null);
      } else if (permission === "denied") {
        setModalType("blocked");
        setPendingContest(null);
      } else {
        // User closed or dismissed browser prompt
        setModalType(null);
        setPendingContest(null);
      }
    } catch {
      setModalType(null);
      setPendingContest(null);
    }
  };

  // Background reminder checker (checks every 30s)
  useEffect(() => {
    const checkReminders = () => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const now = Date.now();
      const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

      contests.forEach((contest) => {
        if (contest.status !== "UPCOMING") return;
        if (!reminders.includes(contest.id)) return;
        if (notifiedContests.includes(contest.id)) return;

        const startTime = new Date(contest.startTime).getTime();
        const timeUntilStart = startTime - now;

        if (timeUntilStart > 0 && timeUntilStart <= FIFTEEN_MINUTES_MS) {
          const notification = new Notification(`🏆 ${contest.site} Contest Starting Soon!`, {
            body: `${contest.name} starts in less than 15 minutes! Click to view.`,
            icon: "/logo.jpg"
          });

          notification.onclick = () => {
            window.focus();
            window.open(contest.url, "_blank");
          };

          setNotifiedContests((prev) => {
            const updated = [...prev, contest.id];
            localStorage.setItem("notified_contests", JSON.stringify(updated));
            return updated;
          });
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [contests, reminders, notifiedContests]);

  // Clean up expired reminders when contests are loaded or refreshed
  useEffect(() => {
    if (loading || contests.length === 0) return;

    const validUpcomingIds = new Set(
      contests
        .filter((c) => c.status === "UPCOMING" && new Date(c.startTime).getTime() > Date.now())
        .map((c) => c.id)
    );

    setReminders((prev) => {
      const cleaned = prev.filter((id) => validUpcomingIds.has(id));
      if (cleaned.length !== prev.length) {
        localStorage.setItem("contest_reminders", JSON.stringify(cleaned));
        return cleaned;
      }
      return prev;
    });

    setNotifiedContests((prev) => {
      const cleaned = prev.filter((id) => validUpcomingIds.has(id));
      if (cleaned.length !== prev.length) {
        localStorage.setItem("notified_contests", JSON.stringify(cleaned));
        return cleaned;
      }
      return prev;
    });
  }, [contests, loading]);

  const activeRemindersCount = contests.filter(
    (c) => c.status === "UPCOMING" && reminders.includes(c.id)
  ).length;

  const filteredContests = contests.filter((c) => {
    if (siteFilter === "REMINDERS") return reminders.includes(c.id) && c.status === "UPCOMING";
    if (siteFilter === "ALL") return true;
    return c.site.toLowerCase() === siteFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        activeRemindersCount={activeRemindersCount}
      />

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className='flex flex-col sm:flex-row gap-4 justify-between items-center mb-10 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50 backdrop-blur-md'>
          {/* Site & Reminder Filter Buttons */}
          <div className='flex flex-wrap gap-1'>
            {["ALL", "REMINDERS", "CODEFORCES", "CODECHEF", "LEETCODE"].map((site) => (
              <button key={site}
                onClick={() => setSiteFilter(site)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${siteFilter === site
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
              >
                {site === "REMINDERS" ? `REMINDERS (${activeRemindersCount})` : site}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchContests}
            disabled={loading}
            className='flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 cursor-pointer disabled:opacity-50 transition-all duration-200'
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className='flex flex-col items-center justify-center py-20 text-slate-400 gap-3'>
            <RefreshCw size={24} className="animate-spin text-indigo-500" />
            <p className='text-sm font-medium'>Loading contests...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className='max-w-md mx-auto text-center py-12 px-6 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-200'>
            <p className='font-bold mb-2'>
              Connection Failed
            </p>
            <p className='text-sm text-red-400 mb-4'>
              {error}
            </p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {filteredContests.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredContests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    isReminded={reminders.includes(contest.id)}
                    onToggleReminder={toggleReminder}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-20 border border-dashed border-slate-800 rounded-2xl'>
                <p className='text-slate-500 text-sm'>
                  {siteFilter === "REMINDERS"
                    ? "No contest reminders set yet. Click the bell icon on any upcoming contest card to turn on reminders!"
                    : "No ongoing or upcoming contests found for this platform."}
                </p>
              </div>
            )}
          </>
        )}

        {/* Notification Modal for soft permission & blocked guides */}
        <NotificationModal
          type={modalType}
          onClose={() => {
            setModalType(null);
            setPendingContest(null);
          }}
          onConfirmPrompt={handleConfirmPrompt}
        />

        {/* User Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  )
}

export default App
