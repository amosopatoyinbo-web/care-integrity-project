import './ChipSelect.css'

export default function ChipSelect({ options, selected, onChange, multi = true }) {
  function toggle(val) {
    if (!multi) {
      onChange([val])
      return
    }
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div className="chip-select" role="group">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`chip${selected.includes(opt) ? ' chip--selected' : ''}`}
          onClick={() => toggle(opt)}
          aria-pressed={selected.includes(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
