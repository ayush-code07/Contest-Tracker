import { useState, useEffect } from 'react'
import { ContestCard } from './components/contestCard'
// when importing type, i should write type before interface in typescript
import { Trophy, RotateCw, RefreshCw } from 'lucide-react'
import type { Contest, APIResponse } from './types/contest'
import './App.css'

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
    } catch (error) {
      setError(error.message || "Error connecting to backend");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="flex flex-col items-center text-center mb-16">
          <div className='inline-flex p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 mb-4'>
            <Trophy size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Contest Tracker
          </h1>
        </header>

        <div className='flex flex-col gap-4 justify-between items-center mb-10 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50'>
          {/* Site Filter Button */}
          <div className='flex flex-wrap gap-1'>
            {["ALL", "CODEFORCES", "CODECHEF", "LEETCODE"].map((site) => (
              <button key={site}
                onClick={() => setSiteFilter(site)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl trasition-all duration-200 cursor-pointer ${siteFilter === site ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
              >
                {site}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchContests}
            className='flex gap-2 px-4 py-2 font-bold text-slate-300 hover:text-white rounded-xl'
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className='flex flex-col items-center justify-center py-20 text-slate-400 gap-3'>
            <RotateCw size={24} className="animate-spin text-indigo-500" />
            <p className='text-sm font-medium'>Loading contests...</p>
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
              <div className='text-center py-20 border border-slate-800 rounded-2xl'>
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
