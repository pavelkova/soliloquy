import { useEffect, useState } from 'react'

let hidden, visibilityChange

function getBrowserProps() {
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }

  return { isDocumentHidden: () => { return !document[hidden] },
           visibilityChange }
  }

export const usePageVisibility = () => {
  if (typeof window === 'undefined') return

  const { isDocumentHidden, visibilityChange } = getBrowserProps()
  const [isVisible, setIsVisible] = useState(isDocumentHidden())
  const onVisibilityChange = () => setIsVisible(isDocumentHidden())

  useEffect(() => {
    document.addEventListener(visibilityChange,
                              onVisibilityChange, false)
    return () => {
      document.removeEventListener(visibilityChange,
                                   onVisibilityChange)
    }
  })

  return isVisible
}
