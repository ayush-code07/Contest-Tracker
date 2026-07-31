import React, { useState, useEffect } from "react";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import type { Contest } from "../types/contest";

interface ContestCardProps {
    contest: Contest;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const start = new Date(contest.startTime).getTime();
            const end = new Date(contest.endTime).getTime();
            if (now < start) {
                const diff = start - now;
                const days = Math.floor((diff / (1000 * 60 * 60 * 24)));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`Starts in ${days}d ${hours}h ${mins}m ${secs}s`);
            } else if (now >= start && now <= end) {
                const diff = end - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`Ongoing! Ends in ${hours}h ${mins}m`);
            } else {
                setTimeLeft("Contest Ended");
            }
        };

        updateTimer();
        // built-in browser function, tells the browser to runs updateTimer function every 1000ms
        const interval = setInterval(updateTimer, 1000);
        // cleanup function - runs when the component is out of the screen or when the user navigates away from the page
        // In React, any function returned from a useEffect hook runs automatically when the component unmounts (is removed from the screen) or right before the effect runs again.
        return () => clearInterval(interval);
    }, [contest]);

    const getSiteStyles = (site: string) => {
        switch (site.toLowerCase()) {
            case "codeforces":
                return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case "leetcode":
                return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case "codechef":
                return "text-purple-400 bg-purple-500/10 border-purple-500/20";
            default:
                return "text-slate-400 bg-slate-500/10 border-slate-500/20";
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status.toUpperCase()) {
            case "ONGOING":
                return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "UPCOMING":
                return "text-sky-400 bg-sky-500/10 border-sky-500/20";
            default:
                return "text-slate-400 bg-slate-500/10 border-slate-500/20";
        }
    }

    // this conver the contest duratino in hours and the toFixed(1) allows only one no. after decimal point
    const durationHours = (contest.durationSeconds / 3600).toFixed(1);

    return (
        <div className="flex flex-col justify-between p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/85 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/60 hover:shadow-2xl hover:shadow-indigo-500/5 group">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${getSiteStyles(contest.site)}`}>
                        {contest.site}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium uppercase rounded border ${getStatusStyles(contest.status)}`}>
                        {contest.status}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2 min-h-[3.5rem] leading-snug">
                    {contest.name}
                </h3>

                <div className="flex flex-col gap-2.5 mb-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-500" />
                        <span>
                            {
                                // new date converts it to js date object so that we can easily do math on it
                                // toLocaleString converts js date object into human readable format,
                                // first arg is [], as to take the local time zone of the user otherwise 
                                // we could pass en-US, en-GB, en-IN etc to format the date in specific 
                                // language's time zone
                                new Date(contest.startTime).toLocaleString([], {
                                    dateStyle: "medium",
                                    timeStyle: "short"
                                })
                            }
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-500" />
                        <span>
                            Duration: {durationHours}h
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <div className={`py-2.5 px-4 rounded-xl text-center font-bold font-mono tracking-wide text-sm mb-3 border ${contest.status === 'ONGOING'
                        ? 'bg-emerald-500/5 text-emerald-300 border-emerald-500/10'
                        : 'bg-indigo-500/5 text-indigo-300 border-indigo-500/10'
                    }`}>
                    {timeLeft}
                </div>
                <a href={contest.url}
                    target="_blank" // this opens the link in the new tab in the browser
                    rel="noopener noreferrer" // this is for security reasons
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.01]"
                >
                    Register for Contest
                    <ExternalLink size={15} />
                </a>
            </div>
        </div>
    )
}