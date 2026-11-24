import { t } from './i18n'
import React from 'react'
import Home from './pages/Home'
import { About, Sustainability, Partners } from './pages/Company'
import { Expertise, ServiceDetail, Solutions, Industries, Cement, Innovation } from './pages/Capabilities'
import { Projects, ProjectDetail, GlobalPresence, Careers, Contact, Privacy, Terms, Cookies } from './pages/Engage'
import { myProjects } from './content/my-projects'
import NotFound from './pages/NotFound'
import { services } from './content/expertise'

export interface RouteDef { path: string; title: string; description: string; render: () => React.ReactNode; image?: string; type?: 'website' | 'article'; noindex?: boolean }

import CareersAdmin, { BusinessAdmin, StaffLoginPage } from './pages/CareersAdmin'

const base: RouteDef[] = [
  { path: '/careers/admin', title: 'Careers admin', description: 'Sign in to manage job openings.', render: () => <CareersAdmin />, noindex: true },
  { path: '/login', title: 'Staff sign-in', description: 'Sign-in for ASEC staff.', render: () => <StaffLoginPage />, noindex: true },
  { path: '/business/admin', title: 'Business inquiries', description: 'Sign in to read business inquiries.', render: () => <BusinessAdmin />, noindex: true },
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
  // One page per project, so each can appear in Google on its own
  ...myProjects.map((p): RouteDef => ({
    path: `/projects/${p.slug}`,
    title: p.title,
    description: p.summary,
    image: p.photo,
    type: 'article',
    render: () => <ProjectDetail slug={p.slug} />,
  })),
]

export const ROUTES: RouteDef[] = [
  ...base,
  // Arabic copies of every public page (/ar, /ar/about, …)
  ...base.filter((r) => !r.noindex).map((r) => ({ ...r, path: r.path === '/' ? '/ar' : '/ar' + r.path })),
]

export const NOT_FOUND: RouteDef = { path: '/404', title: 'Page not found', description: 'Page not found.', render: () => <NotFound /> }

export const matchRoute = (path: string) => ROUTES.find((r) => r.path === path) ?? NOT_FOUND
export const fullTitle = (r: RouteDef) => (r.path === '/' || r.path === '/ar' ? t(r.title) : `${t(r.title)} | ${t('ASEC Automation')}`)
