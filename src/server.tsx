import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { ROUTES, NOT_FOUND, matchRoute, fullTitle } from './routes'
import { setLang, langOf, t, SEEN } from './i18n'

/** Used only at build time to prerender every public page to static HTML. */
export function render(path: string) {
  const route = matchRoute(path)
  const lang = langOf(path)
  const html = renderToString(<App path={path} />)
  setLang(lang)
  return { html, lang, title: fullTitle(route), description: t(route.description), image: route.image, type: route.type ?? 'website', noindex: !!route.noindex }
}
export const paths = [...ROUTES.map((r) => r.path), NOT_FOUND.path]
export const indexable = ROUTES.filter((r) => !r.noindex).map((r) => r.path)

export const seenStrings = () => [...SEEN].sort()
