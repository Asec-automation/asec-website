import React, { useEffect } from 'react'
import { Router, useRouter } from './lib/router'
import { useRevealAll } from './lib/hooks'
import { Header, Footer, ReviewBanner, WhatsAppButton } from './components/Layout'
import { matchRoute, fullTitle } from './routes'
import { REVIEW_MODE } from './content/company'
import { setLang, langOf, t } from './i18n'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() {
    if (this.state.err) return (
      <section className="notfound"><div style={{ display: 'grid', gap: 18, justifyItems: 'center' }}>
        <h1 className="h2">Something went wrong.</h1>
        <p className="lead" style={{ color: 'rgba(255,255,255,.7)' }}>Please reload the page.</p>
        <button className="btn btn--primary" onClick={() => location.reload()}>Reload</button>
      </div></section>
    )
    return this.props.children
  }
}

function Shell() {
  const { path } = useRouter()
  const lang = langOf(path)
  setLang(lang)
  const route = matchRoute(path)
  useRevealAll(path)
  useEffect(() => {
    document.title = fullTitle(route)
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(route.description))
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [route, lang])
  const bare = route.path === '/404'
  return (
    <div className={REVIEW_MODE ? undefined : 'hide-review'}>
      {!bare && <Header />}
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <ErrorBoundary key={path}>{route.render()}</ErrorBoundary>
      </main>
      {!bare && <Footer />}
      {!bare && <WhatsAppButton />}
      <ReviewBanner />
    </div>
  )
}

export default function App({ path }: { path?: string }) {
  return <Router initialPath={path}><Shell /></Router>
}
