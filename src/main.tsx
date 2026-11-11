import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const el = document.getElementById('root')!
document.documentElement.classList.remove('no-js')
if (el.hasChildNodes()) hydrateRoot(el, <App />)
else createRoot(el).render(<App />)
