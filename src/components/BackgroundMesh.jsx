'use client';

/**
 * Ambient background mesh — soft, eye-friendly gradient blobs
 * that slowly drift. Pure CSS (no images, no strain).
 */
export default function BackgroundMesh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-indigo-50/70 to-violet-100 dark:from-[#0b1020] dark:via-[#0e1530] dark:to-[#141b3c]" />

      {/* blob 1 — indigo */}
      <div className="absolute -top-32 -left-24 h-[420px] w-[420px] animate-mesh-1 rounded-full bg-indigo-500/25 blur-3xl dark:bg-indigo-600/20" />
      {/* blob 2 — violet */}
      <div className="absolute top-1/3 -right-28 h-[460px] w-[460px] animate-mesh-2 rounded-full bg-violet-400/22 blur-3xl dark:bg-violet-600/18" />
      {/* blob 3 — cyan */}
      <div className="absolute -bottom-24 left-1/4 h-[380px] w-[380px] animate-mesh-3 rounded-full bg-cyan-400/18 blur-3xl dark:bg-cyan-500/14" />
      {/* blob 4 — amber hint (warmth) */}
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] animate-mesh-2 rounded-full bg-amber-300/12 blur-3xl dark:bg-amber-500/10" />

      {/* subtle vignette to focus center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(15,23,42,0.10)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.45)_100%)]" />

      {/* faint grid for a "lab" feel */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.06] [background-image:linear-gradient(rgba(99,102,241,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.5)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  );
}
