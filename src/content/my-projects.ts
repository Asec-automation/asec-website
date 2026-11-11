import type { Project } from './catalogue'

/**
 * ASEC project list — add your projects here (12 planned).
 *
 * Copy this example for each project, fill it in, and remove the comment marks (//).
 * Required: slug, title, country, industry, solution, summary.
 * Photos go in public/images/projects/ (e.g. /images/projects/my-project.webp).
 * Set featured: true on up to 3 projects to show them on the homepage.
 *
 * {
 *   slug: 'hima-line-3',                       // short unique id, lowercase with dashes
 *   title: 'Hima Plant Line 3 — PCS Upgrade',
 *   clientName: 'LafargeHolcim',               // optional
 *   clientVisible: true,                       // show the client name (only with permission)
 *   country: 'Uganda', city: 'Hima',           // city is optional
 *   industry: 'Cement',                        // used for the Industry filter
 *   solution: 'Control System Modernization',  // shown as "Scope"
 *   year: 2020,                                // optional
 *   status: 'Completed',                       // or 'In progress'
 *   summary: 'One or two sentences describing the project.',
 *   scope: [], technologies: [],
 *   image: 'INDUSTRY_CEMENT_01',
 *   photo: '/images/projects/hima.webp',       // optional real photo
 *   featured: true,                            // show on the homepage
 * },
 */
export const myProjects: Project[] = [
]
