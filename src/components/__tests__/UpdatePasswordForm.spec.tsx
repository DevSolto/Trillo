// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest"
import React from "react"
vi.stubGlobal("React", React)
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const updateUserMock = vi.fn()
vi.mock('@/lib/client', () => ({
  createClient: () => ({ auth: { updateUser: updateUserMock } })
}))
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }))

import { UpdatePasswordForm } from '../UpdatePasswordForm'

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    updateUserMock.mockReset()
    pushMock.mockReset()
  })

  it('requires password input', () => {
    render(<UpdatePasswordForm />)
    expect(screen.getByLabelText(/new password/i)).toBeRequired()
  })

  it('shows error message on failure', async () => {
    updateUserMock.mockResolvedValue({ error: new Error('Failed') })
    render(<UpdatePasswordForm />)
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass')
    await userEvent.click(screen.getByRole('button', { name: /save new password/i }))
    expect(await screen.findByText('Failed')).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('redirects on successful update', async () => {
    updateUserMock.mockResolvedValue({ error: null })
    render(<UpdatePasswordForm />)
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass')
    await userEvent.click(screen.getByRole('button', { name: /save new password/i }))
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/protected'))
  })
})
