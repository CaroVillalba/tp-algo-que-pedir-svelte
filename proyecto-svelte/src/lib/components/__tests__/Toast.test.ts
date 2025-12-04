import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import Toast from '../Toast.svelte'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Importar el store real
import { notifications } from '../../../stores/notificationStore'

describe('Toast.svelte', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    notifications.set([])

    // Limpiar todos los mocks
    vi.restoreAllMocks()
  })

  it('debe renderizar el mensaje y el icono correcto para "success"', () => {
    render(Toast, { message: 'Operación exitosa', type: 'success', id: 1 })

    const container = screen.getByText('Operación exitosa').closest('.toast-container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('toast-success')

    const icon = screen.getByText('✅')
    expect(icon).toBeInTheDocument()
  })

  it('debe renderizar el mensaje y el icono correcto para "error"', () => {
    render(Toast, { message: 'Ocurrió un error', type: 'error', id: 2 })

    const container = screen.getByText('Ocurrió un error').closest('.toast-container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('toast-error')

    const icon = screen.getByText('❌')
    expect(icon).toBeInTheDocument()
  })

  it('debe renderizar el mensaje y el icono correcto para "info"', () => {
    render(Toast, { message: 'Información', type: 'info', id: 3 })

    const container = screen.getByText('Información').closest('.toast-container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('toast-info')

    const icon = screen.getByText('ℹ️')
    expect(icon).toBeInTheDocument()
  })

  it('debe llamar a notifications.update al hacer click en el botón de cerrar', async () => {
    // Espiar el update del store real
    const updateSpy = vi.spyOn(notifications, 'update')

    render(Toast, { message: 'Cerrar test', type: 'success', id: 4 })

    const closeBtn = screen.getByText('X')
    await fireEvent.click(closeBtn)

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith(expect.any(Function))

    // Comprobar que la función filtro elimina correctamente el toast
    const mockState = [{ id: 4, message: 'Cerrar test', type: 'success' as const }]
    const filterFn = updateSpy.mock.calls[0][0]
    const newState = filterFn(mockState)
    expect(newState).toEqual([])
  })
})
