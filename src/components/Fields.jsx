import { memo, useCallback } from 'react'

/*
 * Memoized form field components.
 *
 * Critical design: the onChange prop is called with (name, value) so a
 * single stable parent callback (created with useCallback([])) can be
 * passed to every input without re-creating closures on each keystroke.
 * Combined with React.memo this prevents the "type one char → re-render
 * 50 fields" input lag.
 *
 * Styling uses CSS classes defined in main.jsx's global stylesheet so
 * we don't depend on the parent's style object (which would break memo).
 */

export const Field = memo(function Field({ label, children }) {
  return (
    <div className="cliniq-field">
      <label className="cliniq-label">{label}</label>
      {children}
    </div>
  )
})

export const InputField = memo(function InputField({ name, label, value, onChange, placeholder, type = 'text', inputMode }) {
  const handle = useCallback((e) => onChange(name, e.target.value), [name, onChange])
  return (
    <Field label={label}>
      <input
        type={type}
        inputMode={inputMode}
        value={value || ''}
        onChange={handle}
        placeholder={placeholder}
        className="cliniq-input"
      />
    </Field>
  )
})

export const TextareaField = memo(function TextareaField({ name, label, value, onChange, placeholder, rows = 4 }) {
  const handle = useCallback((e) => onChange(name, e.target.value), [name, onChange])
  return (
    <Field label={label}>
      <textarea
        rows={rows}
        value={value || ''}
        onChange={handle}
        placeholder={placeholder}
        className="cliniq-textarea"
      />
    </Field>
  )
})

export const ToggleGroup = memo(function ToggleGroup({ name, label, options, value, onChange }) {
  return (
    <Field label={label}>
      <div className="cliniq-toggle-group">
        {options.map(opt => (
          <ToggleButton
            key={opt}
            name={name}
            opt={opt}
            active={value === opt}
            onChange={onChange}
          />
        ))}
      </div>
    </Field>
  )
})

const ToggleButton = memo(function ToggleButton({ name, opt, active, onChange }) {
  const handle = useCallback(() => onChange(name, active ? '' : opt), [name, opt, active, onChange])
  return (
    <button
      type="button"
      onClick={handle}
      className={'cliniq-toggle' + (active ? ' cliniq-toggle-active' : '')}
    >
      {opt}
    </button>
  )
})
