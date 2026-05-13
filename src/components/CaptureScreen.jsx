import { useRef, useState, useEffect } from 'react'

function fileToImageData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve({ url: URL.createObjectURL(file), base64: e.target.result })
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function CaptureScreen({ onImage, error }) {
  const galleryRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)

  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cameraState, setCameraState] = useState('idle')
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraError, setCameraError] = useState(null)

  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)

  useEffect(() => () => stopStream(), [])

  // Attach stream to video element once it's in the DOM
  useEffect(() => {
    if (cameraState !== 'streaming' || !streamRef.current || !videoRef.current) return
    const video = videoRef.current
    video.srcObject = streamRef.current
    video.play().catch(() => {})
  }, [cameraState])

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  const openCamera = async () => {
    setCameraState('opening')
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      setCameraState('streaming')
    } catch (err) {
      stopStream()
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        setCameraState('denied')
      } else {
        setCameraError('No se pudo abrir la cámara. Intentá desde la galería.')
        setCameraState('idle')
      }
    }
  }

  const takePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage({ url, base64: e.target.result })
        stopStream()
        setCameraState('previewing')
      }
      reader.readAsDataURL(blob)
    }, 'image/jpeg', 0.92)
  }

  const retake = () => {
    setCapturedImage(null)
    openCamera()
  }

  const cancelCamera = () => {
    stopStream()
    setCameraState('idle')
  }

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setLoading(true)
    const data = await fileToImageData(file)
    setLoading(false)
    onImage(data)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="flex flex-col flex-1 px-5 py-8 gap-6 max-w-sm w-full mx-auto">

      {error && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] text-zinc-500">
          {error}. Intentá de nuevo.
        </div>
      )}

      {cameraError && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] text-zinc-500">
          {cameraError}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-300 mb-5">
            Nueva tarjeta
          </p>

          {isMobile ? (
            <>
              {cameraState === 'idle' && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={openCamera}
                    disabled={loading}
                    className="w-full flex items-center justify-between px-5 py-5 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 transition-all text-left group"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-zinc-900">Sacar foto</p>
                      <p className="text-[12px] text-zinc-400 mt-0.5">Abrí la cámara trasera</p>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-500 transition-colors">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </button>

                  <button
                    onClick={() => galleryRef.current?.click()}
                    disabled={loading}
                    className="w-full flex items-center justify-between px-5 py-5 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 transition-all text-left group"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-zinc-900">Cargar imagen</p>
                      <p className="text-[12px] text-zinc-400 mt-0.5">Desde el carrete</p>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-500 transition-colors">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </button>
                </div>
              )}

              {cameraState === 'opening' && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-500 animate-spin" />
                  <p className="text-[13px] text-zinc-400">Abriendo cámara…</p>
                </div>
              )}

              {cameraState === 'streaming' && (
                <div className="flex flex-col gap-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-xl object-cover aspect-video bg-zinc-900"
                  />
                  <button
                    onClick={takePhoto}
                    className="w-full py-4 rounded-xl text-[15px] font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                  >
                    Tomar foto
                  </button>
                  <button
                    onClick={cancelCamera}
                    className="w-full py-3 text-[13px] text-zinc-400 hover:text-zinc-900 transition-colors text-center"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {cameraState === 'previewing' && capturedImage && (
                <div className="flex flex-col gap-3">
                  <img
                    src={capturedImage.url}
                    className="w-full rounded-xl object-cover aspect-video bg-zinc-100"
                    alt="Vista previa"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={retake}
                      className="flex-1 py-4 rounded-xl text-[15px] font-semibold border border-zinc-100 bg-zinc-50 text-zinc-700 hover:bg-white hover:border-zinc-200 transition-all"
                    >
                      Repetir
                    </button>
                    <button
                      onClick={() => onImage(capturedImage)}
                      className="flex-1 py-4 rounded-xl text-[15px] font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                    >
                      Usar foto
                    </button>
                  </div>
                </div>
              )}

              {cameraState === 'denied' && (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-[13px] text-zinc-500 leading-relaxed">
                    No se pudo acceder a la cámara. Habilitá el permiso en los ajustes del sistema y volvé a intentarlo.
                  </div>
                  <button
                    onClick={() => galleryRef.current?.click()}
                    className="w-full flex items-center justify-between px-5 py-5 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 transition-all text-left group"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-zinc-900">Usar galería en cambio</p>
                      <p className="text-[12px] text-zinc-400 mt-0.5">Desde el carrete</p>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-500 transition-colors">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setCameraState('idle')}
                    className="w-full py-3 text-[13px] text-zinc-400 hover:text-zinc-900 transition-colors text-center"
                  >
                    Volver
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => galleryRef.current?.click()}
              className={[
                'flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition-all py-16',
                dragging
                  ? 'border-zinc-400 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50',
              ].join(' ')}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <div className="text-center">
                <p className="text-[14px] font-medium text-zinc-700">
                  {dragging ? 'Soltá acá' : 'Arrastrá una foto'}
                </p>
                <p className="text-[12px] text-zinc-400 mt-0.5">
                  o hacé click para elegir
                </p>
              </div>
            </div>
          )}
        </div>

        {(cameraState === 'idle' || !isMobile) && (
          <p className="text-[11px] text-zinc-300 text-center">
            JPG · PNG · HEIC · WEBP
          </p>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  )
}
