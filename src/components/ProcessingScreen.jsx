export default function ProcessingScreen({ image }) {
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
