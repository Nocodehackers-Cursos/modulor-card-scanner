import { useRef, useState } from 'react'

function fileToImageData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      resolve({ url: URL.createObjectURL(file), base64 })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function CaptureScreen({ onImage, error }) {
  const cameraRef = useRef(null)
  const galleryRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setLoading(true)
    const data = await fileToImageData(file)
    setPreview(data.url)
    setLoading(false)
    onImage(data)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)

  return (
    <div className="flex flex-col flex-1 px-5 py-6 gap-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}. Intentá de nuevo.
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4">
        {/* Mobile: camera + gallery */}
        {isMobile ? (
          <>
            <button
              onClick={() => cameraRef.current?.click()}
              disabled={loading}
              className="flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 min-h-[200px] active:scale-98 transition-transform"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span className="text-base font-semibold">Sacar foto</span>
            </button>

            <button
              onClick={() => galleryRef.current?.click()}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-4 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Cargar desde galería
            </button>
          </>
        ) : (
          /* Desktop: drag & drop */
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => galleryRef.current?.click()}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all min-h-[300px]',
              dragging
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 scale-[1.01]'
                : 'border-gray-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-gray-50 dark:hover:bg-white/5',
            ].join(' ')}
          >
            {preview ? (
              <img src={preview} alt="Tarjeta" className="max-h-48 rounded-lg object-contain shadow-md" />
            ) : (
              <>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Arrastrá una foto acá
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    o hacé click para elegir un archivo
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-400 dark:text-gray-600">
        Soporta JPG, PNG, HEIC y formatos similares
      </div>

      {/* hidden inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
