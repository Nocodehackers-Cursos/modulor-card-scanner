import { useState } from 'react'
import { BOUTIQUES, OWNERS, HS, HUBSPOT_ENDPOINT } from '../constants'

const inputCls = 'w-full px-4 py-3.5 rounded-xl border border-zinc-100 bg-zinc-50 text-[15px] text-zinc-900 placeholder-zinc-300 outline-none focus:border-zinc-300 focus:bg-white transition-colors'
const labelCls = 'block text-[11px] uppercase tracking-widest font-bold text-zinc-400 mb-2'

function Field({ label, required, children }) {
  return (
    <div>
      <label className={labelCls}>
        {label}{required && <span className="text-zinc-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

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
    leadName: [d.firstname, d.lastname].filter(Boolean).join(' ') + (d.company ? ` — ${d.company}` : ''),
    owner: owner || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const set = (key) => (e) => {
    const val = e.target.value
    setForm((f) => {
      const next = { ...f, [key]: val }
      if (key === 'firstname' || key === 'lastname' || key === 'company') {
        const name = [next.firstname, next.lastname].filter(Boolean).join(' ')
        next.leadName = name + (next.company ? ` — ${next.company}` : '')
      }
      return next
    })
  }

  const toggleBoutique = (b) =>
    setBoutiques((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b])

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
      { name: HS.boutiques, value: boutiques.join(';') },
    ]
    if (form.email) fields.push({ name: HS.email, value: form.email })
    if (form.phone) fields.push({ name: HS.phone, value: form.phone })
    if (form.jobtitle) fields.push({ name: HS.jobtitle, value: form.jobtitle })
    if (form.leadName) fields.push({ name: HS.leadName, value: form.leadName })
    if (form.owner) fields.push({ name: HS.owner, value: form.owner })
    if (form.projectDescription) fields.push({ name: HS.projectDescription, value: form.projectDescription })

    try {
      const resp = await fetch(HUBSPOT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, context: { pageUri: window.location.href, pageName: 'Modulor Card Scanner' } }),
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
    <form onSubmit={handleSubmit} className="flex flex-col">

      {/* Card thumbnail */}
      {image?.url && (
        <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50">
          <img src={image.url} alt="Tarjeta" className="h-10 rounded-lg object-cover grayscale opacity-70" />
          <span className="text-[12px] text-zinc-400 flex-1">Revisá y completá los datos</span>
          <button type="button" onClick={onBack} className="text-[12px] text-zinc-400 hover:text-zinc-900 transition-colors">
            ← Nueva foto
          </button>
        </div>
      )}

      <div className="flex flex-col gap-5 px-5 py-6 max-w-sm w-full mx-auto">

        {/* Boutique */}
        <div>
          <label className={labelCls}>Boutique *</label>
          <div className="flex flex-wrap gap-2">
            {BOUTIQUES.map((b) => {
              const active = boutiques.includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBoutique(b)}
                  className={[
                    'px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all',
                    active
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-100 bg-zinc-50 text-zinc-600 hover:border-zinc-300',
                  ].join(' ')}
                >
                  {b}
                </button>
              )
            })}
          </div>
        </div>

        <div className="h-px bg-zinc-100" />

        {/* Name row */}
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

        <Field label="Cargo">
          <input className={inputCls} value={form.jobtitle} onChange={set('jobtitle')} placeholder="CEO, Dir. de Marketing…" />
        </Field>

        <Field label="Descripción del proyecto">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.projectDescription}
            onChange={set('projectDescription')}
            placeholder="¿De qué hablaron? ¿Qué necesitan?"
          />
        </Field>

        <div className="h-px bg-zinc-100" />

        <Field label="Nombre del lead">
          <input className={inputCls} value={form.leadName} onChange={set('leadName')} />
        </Field>

        <Field label="Owner del lead">
          <select className={inputCls} value={form.owner} onChange={set('owner')}>
            <option value="">— Seleccionar —</option>
            {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>

      </div>

      <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-w-sm w-full mx-auto">
        {error && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] text-zinc-600 mb-3">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl text-[15px] font-semibold transition-all bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Cargando…' : 'Cargar en HubSpot'}
        </button>
      </div>
    </form>
  )
}
