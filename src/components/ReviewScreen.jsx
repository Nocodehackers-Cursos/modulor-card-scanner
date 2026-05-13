import { useState } from 'react'
import { BOUTIQUES, OWNERS, HS, HUBSPOT_ENDPOINT } from '../constants'

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors'

export default function ReviewScreen({ extractedData, image, owner, onSubmitted, onBack }) {
  const d = extractedData || {}

  const [boutiques, setBoutiques] = useState([])
  const [form, setForm] = useState({
    firstname: d.firstname || '',
    lastname: d.lastname || '',
    email: d.email || '',
    phone: d.phone || '',
    company: d.company || '',
    jobtitle: d.jobtitle || '',
    projectDescription: '',
    leadName: d.firstname && d.company
      ? `${d.firstname} ${d.lastname || ''} — ${d.company}`.trim()
      : '',
    owner: owner || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const set = (key) => (e) => {
    const val = e.target.value
    setForm((f) => {
      const next = { ...f, [key]: val }
      if (key === 'firstname' || key === 'lastname' || key === 'company') {
        next.leadName = `${next.firstname} ${next.lastname} — ${next.company}`.trim().replace(/\s+—\s*$/, '')
      }
      return next
    })
  }

  const toggleBoutique = (b) =>
    setBoutiques((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.firstname || !form.lastname || !form.company) {
      setError('Nombre, apellido y empresa son obligatorios.')
      return
    }
    if (boutiques.length === 0) {
      setError('Seleccioná al menos una boutique.')
      return
    }

    setSubmitting(true)
    setError(null)

    const fields = [
      { name: HS.firstname, value: form.firstname },
      { name: HS.lastname, value: form.lastname },
      { name: HS.company, value: form.company },
    ]

    if (form.email) fields.push({ name: HS.email, value: form.email })
    if (form.phone) fields.push({ name: HS.phone, value: form.phone })
    if (form.jobtitle) fields.push({ name: HS.jobtitle, value: form.jobtitle })
    if (form.leadName) fields.push({ name: HS.leadName, value: form.leadName })
    if (form.owner) fields.push({ name: HS.owner, value: form.owner })
    if (form.projectDescription) fields.push({ name: HS.projectDescription, value: form.projectDescription })
    if (boutiques.length) fields.push({ name: HS.boutiques, value: boutiques.join(';') })

    try {
      const resp = await fetch(HUBSPOT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: window.location.href,
            pageName: 'Modulor Card Scanner',
          },
        }),
      })

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}))
        throw new Error(body.message || `Error ${resp.status}`)
      }

      onSubmitted()
    } catch (err) {
      setError(`No se pudo cargar el lead: ${err.message}`)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0">
      {/* card thumbnail strip */}
      {image?.url && (
        <div className="px-5 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
          <img src={image.url} alt="Tarjeta" className="h-12 rounded-md object-cover shadow-sm" />
          <span className="text-xs text-gray-400 dark:text-gray-500">Revisá y completá los datos</span>
          <button type="button" onClick={onBack} className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ← Cambiar foto
          </button>
        </div>
      )}

      <div className="flex flex-col gap-5 px-5 py-5">
        {/* Boutique selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Boutique<span className="text-red-400 ml-0.5">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {BOUTIQUES.map((b) => {
              const active = boutiques.includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBoutique(b)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    active
                      ? 'border-violet-500 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300',
                  ].join(' ')}
                >
                  {b}
                </button>
              )
            })}
          </div>
        </div>

        {/* Contact fields */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre" required>
            <input className={inputCls} value={form.firstname} onChange={set('firstname')} placeholder="Ana" />
          </Field>
          <Field label="Apellido" required>
            <input className={inputCls} value={form.lastname} onChange={set('lastname')} placeholder="García" />
          </Field>
        </div>

        <Field label="Email">
          <input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="ana@empresa.com" />
        </Field>

        <Field label="Teléfono">
          <input className={inputCls} type="tel" value={form.phone} onChange={set('phone')} placeholder="+34 600 000 000" />
        </Field>

        <Field label="Empresa" required>
          <input className={inputCls} value={form.company} onChange={set('company')} placeholder="Empresa S.L." />
        </Field>

        <Field label="Roll de empresa">
          <input className={inputCls} value={form.jobtitle} onChange={set('jobtitle')} placeholder="CEO, Directora de Marketing…" />
        </Field>

        {/* Project description */}
        <Field label="Descripción del proyecto">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.projectDescription}
            onChange={set('projectDescription')}
            placeholder="¿De qué hablaron? ¿Qué necesitan?"
          />
        </Field>

        {/* Lead name */}
        <Field label="Nombre del lead">
          <input className={inputCls} value={form.leadName} onChange={set('leadName')} placeholder="Ana García — Empresa" />
        </Field>

        {/* Owner */}
        <Field label="Owner del lead">
          <select
            className={inputCls}
            value={form.owner}
            onChange={set('owner')}
          >
            <option value="">— Seleccionar —</option>
            {OWNERS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={[
            'w-full py-4 rounded-xl text-sm font-semibold transition-all',
            submitting
              ? 'bg-gray-100 dark:bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-700 text-white active:scale-98',
          ].join(' ')}
        >
          {submitting ? 'Cargando…' : 'Cargar lead en HubSpot'}
        </button>
      </div>
    </form>
  )
}
