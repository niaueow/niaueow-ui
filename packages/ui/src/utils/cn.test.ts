import { describe, expect, it } from 'vitest'
import { cn } from './cn.js'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('drops falsy and conditional values', () => {
    expect(cn('px-4', false, null, undefined, { 'py-2': true, hidden: false })).toBe('px-4 py-2')
  })

  it('lets later Tailwind classes win conflicts', () => {
    expect(cn('px-4 py-2', 'px-8')).toBe('py-2 px-8')
  })

  it('returns an empty string for no input', () => {
    expect(cn()).toBe('')
  })
})
