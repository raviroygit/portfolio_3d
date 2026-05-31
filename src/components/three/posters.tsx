/** Static, zero-JS fallbacks shown before a 3D scene loads or under reduced motion. */

export function OrchestrationPoster() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="spotlight absolute inset-0" />
      <div className="relative size-48 rounded-full border border-signal/30 sm:size-64">
        <div className="absolute inset-6 rounded-full border border-signal/20" />
        <div className="absolute inset-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/20 blur-xl" />
        <div className="absolute inset-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
      </div>
    </div>
  );
}

export function StarfieldPoster() {
  return <div className="absolute inset-0 spotlight opacity-40" />;
}

export function ComputerPoster() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="spotlight absolute inset-0" />
      <div className="relative h-40 w-60 rounded-md border border-signal/30 bg-bg-2/60 sm:h-52 sm:w-80">
        <div className="absolute inset-3 rounded-sm bg-signal/10" />
        <div className="absolute inset-x-0 -bottom-3 mx-auto h-3 w-24 rounded-b-md bg-border-strong" />
      </div>
    </div>
  );
}

export function EarthPoster() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="size-40 rounded-full bg-gradient-to-br from-cyan/30 to-signal/10 blur-2xl" />
    </div>
  );
}
