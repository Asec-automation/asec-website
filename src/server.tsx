import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { ROUTES, NOT_FOUND, matchRoute, fullTitle } from './routes'

/** Used only at build time to prerender every public page to static HTML. */
export function render(path: string) {
  const route = matchRoute(path)
  return { html: renderToString(<App path={path} />), title: fullTitle(route), description: route.description, image: route.image, type: route.type ?? 'website', noindex: !!route.noindex }
}
export const paths = [...ROUTES.map((r) => r.path), NOT_FOUND.path]
export const indexable = ROUTES.filter((r) => !r.noindex).map((r) => r.path)
