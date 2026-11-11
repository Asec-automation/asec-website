import * as R from 'react/jsx-runtime'
import { getLang, tr } from './index'

const ATTRS = ['placeholder', 'aria-label', 'title', 'alt', 'label']
type Props = Record<string, unknown> | null

function fix(type: unknown, props: Props): Props {
  if (!props) return props
  const collecting = typeof window === 'undefined'
  if (getLang() !== 'ar' && !collecting) return props
  let p = props
  const c = props.children
  if (typeof c === 'string') p = { ...p, children: tr(c) }
  else if (Array.isArray(c) && c.some((x) => typeof x === 'string')) p = { ...p, children: c.map((x) => (typeof x === 'string' ? tr(x) : x)) }
  if (typeof type === 'string') {
    for (const a of ATTRS) if (typeof p[a] === 'string') { if (p === props) p = { ...p }; p[a] = tr(p[a] as string) }
    if (type === 'option' && typeof p.children === 'string' && p.value === undefined) { if (p === props) p = { ...p }; p.value = c }
  }
  return p
}

export const Fragment = R.Fragment
export function jsx(type: any, props: any, key?: any) { return R.jsx(type, fix(type, props) as any, key) }
export const jsxDEV = jsx
export function jsxs(type: any, props: any, key?: any) { return R.jsxs(type, fix(type, props) as any, key) }
