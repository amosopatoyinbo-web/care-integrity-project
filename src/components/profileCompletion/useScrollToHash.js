import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './ProfileCompletion.css'

/* After the page has loaded, scroll to the element named in the URL hash (e.g. #sec-bio)
   and briefly highlight it. Used by the edit pages so checklist links land on the right field. */
export default function useScrollToHash(ready) {
  const { hash } = useLocation()
  useEffect(() => {
    if (!ready || !hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!el) return
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('pc-highlight')
      setTimeout(() => el.classList.remove('pc-highlight'), 2200)
    }, 60)
    return () => clearTimeout(t)
  }, [ready, hash])
}
