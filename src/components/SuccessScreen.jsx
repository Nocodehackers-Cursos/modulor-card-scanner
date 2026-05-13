export default function SuccessScreen({ onReset }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 px-5 py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Lead cargado con éxito
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          El contacto ya está en HubSpot.<br />¿Tenés otra tarjeta?
        </p>
      </div>

      <button
        onClick={onReset}
        className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl text-sm font-semibold transition-colors"
      >
        Escanear otra tarjeta
      </button>
    </div>
  )
}
