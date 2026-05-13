import { useState } from 'react'
import { OWNERS } from '../constants'

export default function SetupScreen({ current, onSelect, onCancel }) {
  const [selected, setSelected] = useState(current || null)

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-8 pt-safe">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {current ? 'Cambiar usuario' : '¿Quién sos?'}
        </h1>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Cancelar
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Elegí tu nombre. Se va a usar como owner de los leads que cargues.
      </p>

      <div className="flex flex-col gap-2 flex-1">
        {OWNERS.map((name) => {
          const isSelected = selected === name
          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={[
                'w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all',
                isSelected
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                  : 'border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:border-gray-300 dark:hover:border-white/20',
              ].join(' ')}
            >
              {name}
            </button>
          )
        })}
      </div>

      <button
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
        className={[
          'mt-6 w-full py-4 rounded-xl text-sm font-semibold transition-all',
          selected
            ? 'bg-violet-600 hover:bg-violet-700 text-white'
            : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed',
        ].join(' ')}
      >
        Continuar
      </button>
    </div>
  )
}
