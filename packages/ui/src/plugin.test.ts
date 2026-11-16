import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import NiaueowUI from './index.js'

describe('NiaueowUI plugin', () => {
  it('installs on a Vue app', () => {
    const app = createApp({})
    expect(() => app.use(NiaueowUI)).not.toThrow()
  })
})
