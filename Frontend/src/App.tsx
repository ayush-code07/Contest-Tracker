import { useState, useEffect } from 'react'
import { ContestCard } from './components/contestCard'
// when importing type, i should write type before interface in typescript
import { Trophy, RotateCw } from 'lucide-react'
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
          <div>
            <Trophy size={32} />
          </div>
          <h1 className="text-4xl tracking-tight mb-3">
            Contest Tracker
          </h1>
        </header>

        <div>
          {/* Site Filter Button */}
          <div>
            {["ALL", "CODEFORCES", "CODECHEF", "LEETCODE"].map((site) => (
              <button key={site}
                onClick={() => setSiteFilter(site)}
                className={`px-4 py-2 rounded-lg ${siteFilter === site ? "bg-blue-600" : "bg-slate-700"}`}
              >
                {site}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div>
              <RotateCw size={24} className="animate-spin" />
              <p>Loading contests...</p>
            </div>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <>
              {filteredContests.length > 0 ? (
                <div className='grid'>
                  {filteredContests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                  ))}
                </div>
              ) : (
                <div>
                  <p>No ongoing or upcoming contests found for this platform.</p>
                </div>
              )}
            </>
          )}

        </div>
        <h1>HELLO</h1>
      </div>
    </div>
  )

}

export default App
