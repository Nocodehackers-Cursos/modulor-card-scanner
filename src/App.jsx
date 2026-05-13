import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import CaptureScreen from './components/CaptureScreen'
import ProcessingScreen from './components/ProcessingScreen'
import ReviewScreen from './components/ReviewScreen'
import SuccessScreen from './components/SuccessScreen'

const SCREENS = {
  SETUP: 'setup',
  CAPTURE: 'capture',
  PROCESSING: 'processing',
  REVIEW: 'review',
  SUCCESS: 'success',
}

const OWNER_KEY = 'modulor_owner'

export default function App() {
  const [screen, setScreen] = useState(null)
  const [owner, setOwner] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [image, setImage] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [extractError, setExtractError] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(OWNER_KEY)
    if (saved) {
      setOwner(saved)
      setScreen(SCREENS.CAPTURE)
    } else {
      setScreen(SCREENS.SETUP)
    }
  }, [])

  const handleOwnerSet = (name) => {
    localStorage.setItem(OWNER_KEY, name)
    setOwner(name)
    setShowSettings(false)
    setScreen(SCREENS.CAPTURE)
  }

  const handleImageSelected = async (imageData) => {
    setImage(imageData)
    setExtractError(null)
    setScreen(SCREENS.PROCESSING)
    try {
      const resp = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData.base64 }),
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || 'Error del servidor')
      }
      const data = await resp.json()
      setExtractedData(data)
      setScreen(SCREENS.REVIEW)
    } catch (err) {
      setExtractError(err.message)
      setScreen(SCREENS.CAPTURE)
    }
  }

  const handleSubmitted = () => setScreen(SCREENS.SUCCESS)

  const handleReset = () => {
    setImage(null)
    setExtractedData(null)
    setExtractError(null)
    setScreen(SCREENS.CAPTURE)
  }

  if (screen === null) return null

  if (showSettings || screen === SCREENS.SETUP) {
    return (
      <SetupScreen
        current={owner}
        onSelect={handleOwnerSet}
        onCancel={owner ? () => setShowSettings(false) : null}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
        <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
          Modulor · Card Scanner
        </span>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          {owner?.split(' ')[0]}
        </button>
      </header>

      <main className="flex-1 flex flex-col">
        {screen === SCREENS.CAPTURE && (
          <CaptureScreen onImage={handleImageSelected} error={extractError} />
        )}
        {screen === SCREENS.PROCESSING && (
          <ProcessingScreen image={image} />
        )}
        {screen === SCREENS.REVIEW && (
          <ReviewScreen
            extractedData={extractedData}
            image={image}
            owner={owner}
            onSubmitted={handleSubmitted}
            onBack={handleReset}
          />
        )}
        {screen === SCREENS.SUCCESS && (
          <SuccessScreen onReset={handleReset} />
        )}
      </main>
    </div>
  )
}
