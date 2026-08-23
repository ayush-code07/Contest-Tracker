import React, { useState } from "react";
import { Trophy, LogIn, LogOut, Bell, Cloud, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onOpenAuthModal: () => void;
  activeRemindersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, activeRemindersCount }) => {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // User display name or email fallback
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Trophy size={20} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              Contest Tracker
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                Live
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Active Reminders Badge & Auth Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Active Reminders Pill Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <Bell size={14} className={activeRemindersCount > 0 ? "text-indigo-400 animate-pulse" : "text-slate-500"} />
            <span className="hidden sm:inline">Reminders:</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-400 font-bold">
              {activeRemindersCount}
            </span>
            {user && (
              <span title="Synced with cloud" className="flex items-center text-indigo-400">
                <Cloud size={13} className="ml-1" />
              </span>
            )}
          </div>

          {/* User Account / Sign In State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  {userInitial}
                </div>
                <span className="hidden md:inline text-xs font-bold text-slate-200 max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-indigo-950/40 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Cloud size={13} className="text-indigo-400" />
                      <span>Cloud Sync: <strong className="text-emerald-400">Active</strong></span>
                    </div>

                    <button
                      onClick={async () => {
                        setDropdownOpen(false);
                        await signOut();
                      }}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 py-2 px-3.5 sm:px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 rounded-xl transition-all cursor-pointer hover:scale-[1.02]"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
