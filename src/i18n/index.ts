import AR from './ar.json'

/**
 * Bilingual support (English / Arabic).
 * Every visible text string is passed through `tr()` by the custom JSX runtime
 * (src/i18n/jsx-runtime.ts). On Arabic pages (/ar/…) it is replaced with the
 * translation from ar.json; missing translations fall back to English.
 */
export type Lang = 'en' | 'ar'
let LANG: Lang = 'en'
export const getLang = () => LANG
export const setLang = (l: Lang) => { LANG = l }
export const langOf = (path: string): Lang => (path === '/ar' || path.startsWith('/ar/') ? 'ar' : 'en')
export const stripLang = (path: string) => (langOf(path) === 'ar' ? path.slice(3) || '/' : path)
export const withLang = (path: string, l: Lang = LANG) => (l === 'ar' ? (path === '/' ? '/ar' : '/ar' + path) : path)

const dict = AR as Record<string, string>
/** Strings seen while rendering (used at build time to list what needs translating). */
export const SEEN = new Set<string>()

export function tr(s: string): string {
  const k = s.trim()
  if (!k || !/[A-Za-z]/.test(k)) return s
  if (typeof window === 'undefined') SEEN.add(k)
  if (LANG !== 'ar') return s
  const v = dict[k]
  return v === undefined ? s : s.replace(k, v)
}
/** Translate a whole string, e.g. for document titles. */
export const t = (s: string) => tr(s)
