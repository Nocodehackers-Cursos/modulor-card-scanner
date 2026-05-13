import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Sos un asistente que extrae información de tarjetas personales.
Analizá la imagen y devolvé SOLO un objeto JSON válido con estos campos:
- firstname: nombre de pila (string)
- lastname: apellido (string)
- email: dirección de email (string)
- phone: número de teléfono con código de país si aparece (string)
- company: nombre de la empresa u organización (string)
- jobtitle: cargo o título profesional (string)
- website: sitio web si aparece (string)

Si un campo no está en la tarjeta, devolvé string vacío "".
No devuelvas nada más que el JSON. Sin markdown, sin explicaciones.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { image } = req.body || {}
  if (!image) {
    return res.status(400).json({ error: 'image is required' })
  }

  // Parse base64 data URL
  const match = image.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    return res.status(400).json({ error: 'invalid image format' })
  }
  const [, mediaType, base64Data] = match

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            { type: 'text', text: 'Extraé la información de esta tarjeta personal.' },
          ],
        },
      ],
    })

    const text = message.content[0]?.text || '{}'
    // Strip any accidental markdown code fences
    const clean = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const data = JSON.parse(clean)

    return res.status(200).json(data)
  } catch (err) {
    console.error('Claude extraction error:', err)
    return res.status(500).json({ error: err.message || 'Extraction failed' })
  }
}
