// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest"
import React from "react"
vi.stubGlobal("React", React)
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const signInMock = vi.fn()
vi.mock('@/lib/client', () => ({
  createClient: () => ({ auth: { signInWithPassword: signInMock } })
}))
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }))

import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  beforeEach(() => {
    signInMock.mockReset()
    pushMock.mockReset()
  })

  it('shows validation messages for invalid input', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid')
    await userEvent.type(screen.getByLabelText(/password/i), '123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText('Email inválido')).toBeInTheDocument()
    expect(await screen.findByText('Senha precisa ter no mínimo 6 caracteres')).toBeInTheDocument()
    expect(signInMock).not.toHaveBeenCalled()
  })

  it('renders error message on failed login', async () => {
    signInMock.mockResolvedValue({ error: new Error('Invalid credentials') })
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('redirects on successful login', async () => {
    signInMock.mockResolvedValue({ error: null })
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/protected'))
  })
})
