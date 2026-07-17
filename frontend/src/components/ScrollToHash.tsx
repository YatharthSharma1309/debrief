import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'



/** Scroll to top on route change; scroll to hash targets when present. */

export default function ScrollToHash() {

  const { pathname, hash } = useLocation()



  useEffect(() => {

    if (!hash) {

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

      return

    }



    const id = hash.replace('#', '')

    const scroll = () => {

      const el = document.getElementById(id)

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })

    }

    requestAnimationFrame(() => requestAnimationFrame(scroll))

  }, [pathname, hash])



  return null

}


