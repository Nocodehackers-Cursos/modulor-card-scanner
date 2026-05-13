export default function ProcessingScreen({ image }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 px-5 py-12">
      {image?.url && (
        <div className="relative">
          <img
            src={image.url}
            alt="Tarjeta"
            className="w-64 h-40 object-cover rounded-xl shadow-lg opacity-60"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-violet-200 dark:border-violet-900" />
          <div className="absolute inset-0 rounded-full border-2 border-t-violet-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Extrayendo información…
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Claude está analizando la tarjeta
          </p>
        </div>
      </div>
    </div>
  )
}
