import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
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
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`Starts in ${hours}h ${mins}m ${secs}s`);
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

    const durationHours = (contest.durationSeconds / 3600).toFixed(1);

    return (
        <div>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${getSiteStyles(contest.site)}`}>
                        {contest.site}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium uppercase rounded border ${getStatusStyles(contest.status)}`}>
                        {contest.status}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-3">
                    {contest.name}
                </h3>

                <div>
                    <div>
                        <Calendar size={16} className="text-slate-500" />
                        <span>
                            {
                                new Date(contest.startTime).toLocaleString([], {
                                    dateStyle: "medium",
                                    timeStyle: "short"
                                })
                            }
                        </span>
                    </div>

                    <div>
                        <Clock size={16} className="text-slate-500" />
                        <span>
                            Duration: {durationHours}h
                        </span>
                    </div>
                </div>
            </div>

            <div>
                {timeLeft}
            </div>
            <a href={contest.url}>
                Register for Contest
            </a>
        </div>
    )
}