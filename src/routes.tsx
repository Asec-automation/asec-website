import React from 'react'
import Home from './pages/Home'
import { About, Sustainability, Partners } from './pages/Company'
import { Expertise, ServiceDetail, Solutions, Industries, Cement, Innovation } from './pages/Capabilities'
import { Projects, GlobalPresence, Careers, Contact, Privacy, Terms, Cookies } from './pages/Engage'
import NotFound from './pages/NotFound'
import { services } from './content/expertise'

export interface RouteDef { path: string; title: string; description: string; render: () => React.ReactNode; image?: string; type?: 'website' | 'article'; noindex?: boolean }

import CareersAdmin from './pages/CareersAdmin'

const base: RouteDef[] = [
  { path: '/careers/admin', title: 'Careers admin', description: 'Sign in to manage job openings.', render: () => <CareersAdmin />, noindex: true },
  { path: '/', title: 'ASEC Automation — Engineering Intelligence. Automating Industry.', description: 'Industrial automation, process control and engineering expertise with a strong focus on cement plant automation.', render: () => <Home /> },
  { path: '/about', title: 'About ASEC', description: 'Who we are: engineering and automation expertise for industrial operations.', render: () => <About /> },
  { path: '/projects', title: 'Projects', description: 'Approved project case studies.', render: () => <Projects /> },
  { path: '/global-presence', title: 'Global Presence', description: 'An international industrial perspective — interactive map.', render: () => <GlobalPresence /> },
  { path: '/partners', title: 'Partners & Technologies', description: 'Our technology ecosystem.', render: () => <Partners /> },
  { path: '/careers', title: 'Careers', description: 'Careers in industrial automation and engineering.', render: () => <Careers /> },
  { path: '/contact', title: 'Contact Us', description: 'Contact ASEC Automation about industrial automation and engineering opportunities.', render: () => <Contact /> },
  { path: '/privacy', title: 'Privacy Policy', description: 'Privacy policy.', render: () => <Privacy /> },
  { path: '/terms', title: 'Terms of Use', description: 'Terms of use.', render: () => <Terms /> },
  { path: '/cookies', title: 'Cookie Preferences', description: 'Cookie information and preferences.', render: () => <Cookies /> },
]

export const ROUTES: RouteDef[] = [
  ...base,
]

export const NOT_FOUND: RouteDef = { path: '/404', title: 'Page not found', description: 'Page not found.', render: () => <NotFound /> }

export const matchRoute = (path: string) => ROUTES.find((r) => r.path === path) ?? NOT_FOUND
export const fullTitle = (r: RouteDef) => (r.path === '/' ? r.title : `${r.title} | ASEC Automation`)
