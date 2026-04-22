export function AppBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background px-4">
      {/* Dynamic drifting professional orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -top-[10%] left-[5%] size-[75vmax] rounded-full bg-slate-400/5 blur-[130px]" />
        <div className="animate-float-reverse absolute top-[5%] -right-[20%] size-[65vmax] rounded-full bg-indigo-500/10 blur-[150px]" />
        <div className="animate-float absolute -bottom-[20%] left-[15%] size-[70vmax] rounded-full bg-slate-500/5 blur-[140px]" />
        <div className="animate-float-reverse absolute bottom-[5%] left-[-15%] size-[55vmax] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Sober Mesh Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          background:
            "radial-gradient(circle at 10% 10%, oklch(0.6 0.1 250 / 0.05) 0%, transparent 45%)," +
            "radial-gradient(circle at 90% 10%, oklch(0.5 0.1 280 / 0.05) 0%, transparent 45%)," +
            "radial-gradient(circle at 50% 90%, oklch(0.7 0.1 200 / 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Surface highlights with professional touch */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-500/10 to-transparent" />
    </div>
  )
}
