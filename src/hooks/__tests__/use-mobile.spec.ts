// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useIsMobile } from '../use-mobile'

const MOBILE_BREAKPOINT = 768

// helpers for mocking matchMedia and resizing
let listeners: Set<(e: MediaQueryListEvent) => void>

function resize(width: number) {
  window.innerWidth = width
  listeners.forEach((cb) => cb({ matches: width < MOBILE_BREAKPOINT } as MediaQueryListEvent))
}

beforeEach(() => {
  listeners = new Set()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: window.innerWidth < MOBILE_BREAKPOINT,
    media: query,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
  }))
})

describe('useIsMobile', () => {
  it('returns true when width is below breakpoint', () => {
    resize(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('returns false when width is above breakpoint', () => {
    resize(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('updates value on resize', () => {
    resize(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
    act(() => resize(500))
    expect(result.current).toBe(true)
  })
})
