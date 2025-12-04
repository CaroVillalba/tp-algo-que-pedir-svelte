import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom'
import PasswordInput from '../PasswordInput.svelte'

describe('PasswordInput.svelte', () => {
  const defaultProps = {
    id: 'test-password',
    label: 'Contraseña',
    placeholder: 'Ingresa tu clave',
    value: '123',
    maxlength: 50,
    required: true,
  }

  // --- Test 1: Renderizado Inicial y Propiedades ---
  it('debe renderizarse con las props correctas y tipo "password" inicialmente', () => {
    render(PasswordInput, { props: defaultProps })

    expect(screen.getByLabelText(defaultProps.label)).toBeInTheDocument()

    // Verificar el tipo de input inicial
    const inputElement = screen.getByPlaceholderText(defaultProps.placeholder)
    expect(inputElement).toHaveAttribute('type', 'password')

    expect(inputElement).toHaveAttribute('id', defaultProps.id)
    expect(inputElement).toHaveAttribute('maxlength', '50')
    expect(inputElement).toHaveAttribute('required')
  })

  // --- Test 2: Enlace de Valores (Binding) ---
  it('debe actualizar el valor cuando el usuario escribe en el input', async () => {

    render(PasswordInput, { props: defaultProps })

    const inputElement = screen.getByPlaceholderText(defaultProps.placeholder)
    const newValue = 'nuevaClave'

    await fireEvent.input(inputElement, { target: { value: newValue } })

    expect(inputElement).toHaveValue(newValue)
  })

  // --- Test 3: Alternar Visibilidad (Mostrar) ---
  it('debe cambiar el tipo de input a "text" al hacer click en el icono de mostrar', async () => {
    render(PasswordInput, { props: defaultProps })

    const inputElement = screen.getByPlaceholderText(defaultProps.placeholder)

    const toggleButton = screen.getByLabelText('Mostrar Contraseña')

    await fireEvent.click(toggleButton)

    expect(inputElement).toHaveAttribute('type', 'text')

    expect(screen.getByLabelText('Ocultar Contraseña')).toBeInTheDocument()
    expect(screen.queryByLabelText('Mostrar Contraseña')).not.toBeInTheDocument()
  })

  // --- Test 4: Alternar Visibilidad (Ocultar) ---
  it('debe volver a cambiar el tipo de input a "password" al hacer doble click', async () => {
    render(PasswordInput, { props: defaultProps })

    const inputElement = screen.getByPlaceholderText(defaultProps.placeholder)
    let toggleButton = screen.getByLabelText('Mostrar Contraseña')

    await fireEvent.click(toggleButton)
    expect(inputElement).toHaveAttribute('type', 'text')

    toggleButton = screen.getByLabelText('Ocultar Contraseña')

    await fireEvent.click(toggleButton)

    expect(inputElement).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Mostrar Contraseña')).toBeInTheDocument()
  })
})