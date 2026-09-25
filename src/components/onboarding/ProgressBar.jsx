import './ProgressBar.css'

export default function ProgressBar({ steps, current }) {
  return (
    <div className="ob-progress" role="navigation" aria-label="Form progress">
      <div className="ob-progress__track">
        <div
          className="ob-progress__fill"
          style={{ width: `${((current - 1) / (steps.length - 1)) * 100}%` }}
          aria-hidden="true"
        />
        {steps.map((label, i) => {
          const num = i + 1
          const done = num < current
          const active = num === current
          return (
            <div
              key={label}
              className={`ob-progress__step${done ? ' done' : ''}${active ? ' active' : ''}`}
            >
              <div className="ob-progress__circle" aria-hidden="true">
                {done ? '✓' : num}
              </div>
              <span className="ob-progress__label">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
