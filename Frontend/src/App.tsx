import { useState, useEffect } from 'react'
import { ContestCard } from './components/contestCard'
// when importing type, i should write type before interface in typescript
import { Trophy, RefreshCw } from 'lucide-react'
import type { Contest, APIResponse } from './types/contest'

function App() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [siteFilter, setSiteFilter] = useState<string>("ALL");

  const fetchContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/contests");
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

  const filteredContests = contests.filter((c) => {
    if (siteFilter === "ALL") return true;
    return c.site.toLowerCase() === siteFilter.toLowerCase();
  })



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] font-sans antialiased">
      {/* this antialiased forces macOS and iOS browsers to use grayscale font smoothing, ensuring all your text looks ultra-sharp, crisp, and clean against that dark Slate 950 background! */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-16">
          <div className='inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 mb-4 shadow-inner'>
            <Trophy size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-400 to-violet-400">
            Contest Tracker
          </h1>
          <p className='text-slate-400 max-w-md text-sm sm:text-base leading-relaxed'>
            Never miss another contest. Track and filter upcoming programming challenges in real-time.
          </p>
        </header>

        <div className='flex flex-col sm:flex-row gap-4 justify-between items-center mb-10 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50 backdrop-blur-md'>
          {/* Site Filter Button */}
          <div className='flex flex-wrap gap-1'>
            {["ALL", "CODEFORCES", "CODECHEF", "LEETCODE"].map((site) => (
              <button key={site}
                onClick={() => setSiteFilter(site)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${siteFilter === site
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
              >
                {site}
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
              // if we are not writing the grid-cols-1 without a prefix, then it will work according to phone, bcz tailwindcss styling is mobile-first
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredContests.map((contest) => (
                  <ContestCard key={contest.id} contest={contest} />
                ))}
              </div>
            ) : (
              <div className='text-center py-20 border border-dashed border-slate-800 rounded-2xl'>
                <p className='text-slate-500 text-sm'>No ongoing or upcoming contests found for this platform.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

}

export default App
