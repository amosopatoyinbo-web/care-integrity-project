import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BackButton from './BackButton'
import { getTrail } from '../lib/navTrail'
import './SubNav.css'

/* One slim row: Back button + breadcrumbs. Always rendered directly below the site/page header. */
export default function SubNav({ trail }) {
  const { pathname, search } = useLocation()
  const items = trail || getTrail(pathname, search)
  const crumbsRef = useRef(null)
  const key = items.map(i => i.label).join('>')

  useEffect(() => {
    const el = crumbsRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [key])

  return (
    <div className="cip-subnav">
      <div className="cip-subnav__inner">
        <BackButton />
        <nav className="cip-subnav__crumbs" aria-label="Breadcrumb" ref={crumbsRef}>
          <ol>
            {items.map((item, i) => {
              const last = i === items.length - 1
              return (
                <li key={`${item.label}-${i}`} className={last ? 'is-current' : ''}>
                  {item.to && !last
                    ? <Link to={item.to}>{item.label}</Link>
                    : <span aria-current={last ? 'page' : undefined}>{item.label}</span>}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}