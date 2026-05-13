export default function SuccessScreen({ onReset }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-10 px-5 py-16 text-center max-w-sm mx-auto w-full">
      <div className="w-14 h-14 rounded-full border border-zinc-100 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-300 mb-3">
          Listo
        </p>
        <h2 className="text-[22px] font-bold tracking-tight text-zinc-900">
          Lead cargado
        </h2>
        <p className="text-[14px] text-zinc-400 mt-2">
          El contacto ya está en HubSpot.
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 rounded-xl text-[15px] font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
      >
        Escanear otra tarjeta
      </button>
    </div>
  )
}
