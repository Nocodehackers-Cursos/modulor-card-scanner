export default function ProcessingScreen({ image, extractError, onRetry, onNewPhoto }) {
  if (extractError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-8 px-5 py-16 max-w-sm mx-auto w-full">
        {image?.url && (
          <img src={image.url} alt="Tarjeta" className="w-64 h-40 object-cover rounded-xl opacity-50 grayscale" />
        )}
        <div className="text-center">
          <p className="text-[15px] font-medium text-zinc-900">No se pudo extraer la información</p>
          <p className="text-[13px] text-zinc-400 mt-1.5">{extractError}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onNewPhoto}
            className="flex-1 py-4 rounded-xl text-[15px] font-semibold border border-zinc-100 bg-zinc-50 text-zinc-700 hover:bg-white hover:border-zinc-200 transition-all"
          >
            Nueva foto
          </button>
          <button
            onClick={onRetry}
            className="flex-1 py-4 rounded-xl text-[15px] font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-10 px-5 py-16">
      {image?.url && (
        <img
          src={image.url}
          alt="Tarjeta"
          className="w-64 h-40 object-cover rounded-xl opacity-50 grayscale"
        />
      )}

      <div className="flex flex-col items-center gap-5">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border border-zinc-100" />
          <div className="absolute inset-0 rounded-full border border-t-zinc-900 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-medium text-zinc-900">
            Extrayendo información…
          </p>
          <p className="text-[12px] text-zinc-400 mt-1.5">
            Claude está analizando la tarjeta
          </p>
        </div>
      </div>
    </div>
  )
}
