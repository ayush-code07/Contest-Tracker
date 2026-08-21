import React from "react";
import { BellRing, BellOff, Lock, AlertCircle, X } from "lucide-react";

export type NotificationModalType = "prompt" | "blocked" | "unsupported";

interface NotificationModalProps {
  type: NotificationModalType | null;
  onClose: () => void;
  onConfirmPrompt?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  type,
  onClose,
  onConfirmPrompt,
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-indigo-950/40 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {type === "prompt" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 shadow-inner">
              <BellRing size={28} className="animate-bounce" />
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
              Enable Contest Alerts
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Get notified directly in your browser <span className="text-indigo-400 font-semibold">15 minutes before</span> the contest begins so you never miss the start!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 flex-1 py-2.5 px-4 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all cursor-pointer"
              >
                Maybe Later
              </button>
              <button
                onClick={onConfirmPrompt}
                className="order-1 sm:order-2 flex-1 py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 rounded-xl transition-all cursor-pointer hover:scale-[1.02]"
              >
                Allow Notifications
              </button>
            </div>
          </div>
        )}

        {type === "blocked" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 shadow-inner">
              <BellOff size={28} />
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
              Notifications Are Blocked
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Your browser is currently blocking notifications for this website. Follow these quick steps to unblock them:
            </p>

            <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6 text-left flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                  1
                </span>
                <p className="text-xs text-slate-300">
                  Click the <Lock size={12} className="inline mx-1 text-slate-400" /> icon or tune settings next to the URL in your address bar.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                  2
                </span>
                <p className="text-xs text-slate-300">
                  Find <strong className="text-white">Notifications</strong> and switch it from <em>Block</em> to <strong className="text-emerald-400">Allow</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                  3
                </span>
                <p className="text-xs text-slate-300">
                  Return to this page and click the bell icon again!
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 rounded-xl transition-all cursor-pointer"
            >
              Got It
            </button>
          </div>
        )}

        {type === "unsupported" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 shadow-inner">
              <AlertCircle size={28} />
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
              Browser Not Supported
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Your current browser does not support Web Notifications. Try using a modern browser like Google Chrome, Microsoft Edge, or Mozilla Firefox.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
