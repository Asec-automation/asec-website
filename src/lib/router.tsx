import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getLang, withLang } from '../i18n'

/**
 * Minimal router. 'history' mode (clean URLs, used for real hosting with
 * prerendered pages) or 'hash' mode (used for single-file previews).
 */
declare const __ROUTER_MODE__: 'history' | 'hash'
const MODE: 'history' | 'hash' = typeof __ROUTER_MODE__ !== 'undefined' ? __ROUTER_MODE__ : 'history'

interface Ctx { path: string; navigate: (to: string) => void }
const RouterCtx = createContext<Ctx>({ path: '/', navigate: () => {} })

// Hash mode uses plain names (#industries--cement) so it works inside sandboxed previews.
const toHash = (p: string) => (p === '/' ? '' : p.replace(/^\//, '').replace(/\//g, '--'))
const fromHash = (h: string) => '/' + h.replace(/^#\/?/, '').replace(/--/g, '/')

const readPath = () => {
  if (typeof window === 'undefined') return '/'
  if (MODE === 'hash') return fromHash(window.location.hash).replace(/\/+$/, '') || '/'
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

export function Router({ initialPath, children }: { initialPath?: string; children: React.ReactNode }) {
  const [path, setPath] = useState(initialPath ?? readPath())

  useEffect(() => {
    const on = () => setPath(readPath())
    window.addEventListener(MODE === 'hash' ? 'hashchange' : 'popstate', on)
    return () => window.removeEventListener(MODE === 'hash' ? 'hashchange' : 'popstate', on)
  }, [])

  const navigate = useCallback((to: string) => {
    const [p, hashFrag] = to.split('#')
    if (MODE === 'hash') window.location.hash = toHash(p)
    else window.history.pushState({}, '', p)
    setPath(p.replace(/\/+$/, '') || '/')
    requestAnimationFrame(() => {
      if (hashFrag) document.getElementById(hashFrag)?.scrollIntoView()
      else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      document.getElementById('main')?.focus({ preventScroll: true })
    })
  }, [])

  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>
}

export const useRouter = () => useContext(RouterCtx)

export const href = (to: string) => (MODE === 'hash' ? `#${toHash(to)}` : to)

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
export function Link({ to: rawTo, onClick, children, ...rest }: LinkProps) {
  const { path, navigate } = useRouter()
  const external = /^(https?:|mailto:|tel:)/.test(rawTo)
  const to = !external && rawTo.startsWith('/') && getLang() === 'ar' && !/^\/ar(\/|$|#)/.test(rawTo) ? withLang(rawTo.split('#')[0], 'ar') + (rawTo.includes('#') ? '#' + rawTo.split('#')[1] : '') : rawTo
  const active = !external && (to === '/' ? path === '/' : path === to || path.startsWith(to + '/'))
  return (
    <a
      href={external ? to : href(to)}
      aria-current={active && to.split('#')[0] === path ? 'page' : undefined}
      data-active={active || undefined}
      onClick={(e) => {
        onClick?.(e)
        if (external || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
      {...(external && to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
