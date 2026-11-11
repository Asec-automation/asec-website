import React from 'react'
import { Link } from '../lib/router'
import { Arrow } from '../components/ui'

export default function NotFound() {
  return (
    <section className="notfound">
      <div style={{ display: 'grid', gap: 22, justifyItems: 'center' }}>
        <div className="num" aria-hidden>404</div>
        <h1 className="h2">This page is off the process line.</h1>
        <p className="lead" style={{ color: 'rgba(255,255,255,.7)' }}>The page you’re looking for doesn’t exist or has moved.</p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn--primary">Back to home <Arrow /></Link>
          <Link to="/contact" className="btn btn--ghost">Contact us</Link>
        </div>
      </div>
    </section>
  )
}
