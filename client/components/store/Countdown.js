"use client";

import { useEffect, useState } from "react";

export function Countdown() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 8 + 1000 * 60 * 23);
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, (now ?? target) - Date.now() + (target - Date.now()));
  const d = now === null ? null : Math.max(0, target - now);
  const h = d === null ? "--" : String(Math.floor(d / 3600000)).padStart(2, "0");
  const m = d === null ? "--" : String(Math.floor((d % 3600000) / 60000)).padStart(2, "0");
  const s = d === null ? "--" : String(Math.floor((d % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      {[[h, "Hrs"], [m, "Min"], [s, "Sec"]].map(([val, label], i) => (
        <div key={label} className="flex items-center gap-2">
          {i > 0 && <span className="text-2xl font-bold text-gold-foreground">:</span>}
          <div className="flex flex-col items-center">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-ink font-display text-2xl font-bold tabular-nums text-primary-foreground shadow-inner">
              {val}
            </div>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground/80">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

