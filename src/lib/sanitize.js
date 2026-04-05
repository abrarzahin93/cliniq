// Input sanitization helpers — prevents prompt injection and XSS
// Applied before any user text is sent to Claude API or stored

const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F]/g
const ZERO_WIDTH_BIDI = /[\u200B-\u200F\u202A-\u202E\uFEFF]/g
const MARKDOWN_FENCE = /```/g

/**
 * Sanitize a user-provided string before sending to an LLM or storing.
 * - Strips control characters (null, backspace, etc.)
 * - Strips zero-width and bidi-override Unicode (anti-spoofing)
 * - Replaces markdown code fences (prevents JSON-fence breakout)
 * - Caps length to prevent prompt stuffing
 */
export function sanitizeForPrompt(str, maxLen = 2000) {
  if (typeof str !== 'string') return ''
  return str
    .replace(CONTROL_CHARS, ' ')
    .replace(ZERO_WIDTH_BIDI, '')
    .replace(MARKDOWN_FENCE, "'''")
    .slice(0, maxLen)
    .trim()
}

/**
 * Sanitize every string field of a patient object.
 * Preserves non-string fields and structured generalExam.
 */
export function sanitizePatient(p) {
  if (!p || typeof p !== 'object') return p
  const out = { ...p }
  for (const k of Object.keys(out)) {
    if (typeof out[k] === 'string') {
      out[k] = sanitizeForPrompt(out[k], 4000)
    } else if (k === 'generalExam' && out[k] && typeof out[k] === 'object') {
      const ge = { ...out[k] }
      for (const gk of Object.keys(ge)) {
        if (typeof ge[gk] === 'string') ge[gk] = sanitizeForPrompt(ge[gk], 500)
      }
      out[k] = ge
    }
  }
  return out
}

/**
 * HTML-escape a string for safe rendering in attributes or innerText.
 * (Use for building PDF/referral letters that use innerHTML.)
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
