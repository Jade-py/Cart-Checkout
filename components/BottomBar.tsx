"use client";

interface Props {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function BottomBar({
  onBack,
  onNext,
  nextLabel = "Continue",
  backLabel = "Back",
  loading = false,
  disabled = false,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-forest-100"
      style={{ boxShadow: "0 -4px 24px rgba(46,99,48,0.08)" }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex gap-3 items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl border-2 border-forest-200 text-forest-600 text-sm font-medium hover:bg-forest-50 hover:border-forest-300 transition-all whitespace-nowrap"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {backLabel}
          </button>
        )}
        <button
          onClick={onNext}
          disabled={loading || disabled}
          className={`btn-primary flex-1 py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase flex items-center justify-center gap-2 ${
            loading || disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Processing…
            </>
          ) : (
            <>
              {nextLabel}
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
