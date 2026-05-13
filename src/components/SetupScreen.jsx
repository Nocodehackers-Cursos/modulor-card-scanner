import { useState } from 'react'
import { OWNERS } from '../constants'

function ModulorLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#0a0a0a"/>
      <path d="M5 6h10.5L10.25 26H5V6z" fill="white"/>
      <path d="M16.5 6H27v20h-5.25L16.5 6z" fill="white"/>
    </svg>
  )
}

export default function SetupScreen({ current, onSelect, onCancel }) {
  const [selected, setSelected] = useState(current || null)

  return (
    <div className="flex flex-col min-h-dvh bg-white px-5">
      <div className="flex flex-col items-center pt-16 pb-10">
        <ModulorLogo size={44} />
        <h1 className="text-[22px] font-bold tracking-tight text-zinc-900 mt-5">
          Card Scanner
        </h1>
        <p className="text-[13px] text-zinc-400 mt-1.5">
          {current ? 'Cambiar usuario' : '¿Quién sos?'}
        </p>
      </div>

      <div className="flex flex-col gap-2 flex-1 max-w-sm w-full mx-auto pb-36">
        {OWNERS.map((name) => {
          const active = selected === name
          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={[
                'w-full text-left px-4 py-3.5 rounded-xl border text-[15px] font-medium transition-all',
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-100 bg-zinc-50 text-zinc-700 hover:border-zinc-200 hover:bg-white',
              ].join(' ')}
            >
              {name}
            </button>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-5 pb-8 pt-4 flex flex-col gap-3">
        <button
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full py-4 rounded-xl text-[15px] font-semibold transition-all bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full py-3.5 rounded-xl text-[14px] text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}
