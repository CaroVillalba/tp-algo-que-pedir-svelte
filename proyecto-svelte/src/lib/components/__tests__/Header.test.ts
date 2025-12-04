import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import Header from '../Header.svelte'

// 1. Mock de dependencias de SvelteKit
import { goto } from '$app/navigation'
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}))

// 2. Mock de iconos para simplificar el DOM
vi.mock('phosphor-svelte', () => ({
  ChefHat: vi.fn(() => ({ default: 'ChefHatMock' })),
  List: vi.fn(() => ({ default: 'ListMock' })),
}))

// 3. Simulación de window.location para el onMount
const mockLocation = (pathname: string) => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { pathname },
  })
}

describe('Header.svelte', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Valor por defecto para las pruebas
    mockLocation('/main/menu')
    // Simular el tamaño de pantalla para que el menú principal esté visible inicialmente (>= 768px)
    window.resizeTo(1024, 768)
  })



  // --- Test 1: Comportamiento Inicial (onMount) y Clase 'active' ---
  it('debe establecer la pestaña activa basada en la URL al montar', async () => {
    mockLocation('/main/ingredients')
    render(Header)

    const primaryNav = screen.getByRole('navigation')


    await waitFor(() => {

      const activeLink = within(primaryNav).getByRole('link', { name: /ingredientes/i })
      expect(activeLink).toHaveClass('active')

      // 4. Buscar otro enlace inactivo dentro del mismo contenedor
      const inactiveLink = within(primaryNav).getByRole('link', { name: /menú/i })
      expect(inactiveLink).not.toHaveClass('active')
    })
  })

  // --- Test 2: Alternar Menú de Usuario (userMenu) ---
  it('debe abrir y cerrar el menú de usuario al hacer click en el perfil', async () => {
    render(Header)

    const profileImage = screen.getByAltText('User Profile')
    const userDropdown = screen.getByRole('button', { name: /cerrar sesión/i }).closest('.user-dropdown-menu')

    expect(userDropdown).not.toHaveClass('open')


    await fireEvent.click(profileImage)
    expect(userDropdown).toHaveClass('open')


    await fireEvent.click(profileImage)
    expect(userDropdown).not.toHaveClass('open')
  })

  // --- Test 3: Alternar Menú de Navegación (navMenu) ---
  it('debe abrir y cerrar el menú expandible al hacer click en el icono de Lista', async () => {
    resizeTo(600, 800)
    render(Header)

    const menuButton = screen.getByRole('button', { name: /menu/i })

    const expandableMenu = document.getElementById('expandable-menu')

    expect(expandableMenu).toBeInTheDocument()


    expect(expandableMenu).toHaveClass('folded-menu')

    await fireEvent.click(menuButton)
    expect(expandableMenu).toHaveClass('unfolded-menu')

    await fireEvent.click(menuButton)
    expect(expandableMenu).toHaveClass('folded-menu')
  })


  // --- Test 4: Exclusividad de Menús (User vs Nav) ---
  it('al abrir un menú, el otro debe cerrarse automáticamente', async () => {
    // Simular un tamaño donde ambos toggles son relevantes
    resizeTo(800, 800)
    render(Header)

    const navButton = screen.getByRole('button', { name: /menu/i })
    const profileImage = screen.getByAltText('User Profile')

    const userDropdown = screen.getByRole('button', { name: /cerrar sesión/i }).closest('.user-dropdown-menu')

    const expandableMenu = document.getElementById('expandable-menu')

    expect(expandableMenu).toBeInTheDocument()

    await fireEvent.click(navButton)
    expect(expandableMenu).toHaveClass('unfolded-menu')
    expect(userDropdown).not.toHaveClass('open')


    await fireEvent.click(profileImage)
    expect(userDropdown).toHaveClass('open')
    expect(expandableMenu).toHaveClass('folded-menu')


    await fireEvent.click(navButton)
    expect(expandableMenu).toHaveClass('unfolded-menu')
    expect(userDropdown).not.toHaveClass('open')
  })

  // --- Test 5: Funcionalidad de Cerrar Sesión ---
  it('debe llamar a goto y cerrar el menú de usuario al hacer click en "Cerrar sesión"', async () => {
    render(Header)

    const profileImage = screen.getByAltText('User Profile')

    // 1. Abrir el menú de usuario
    await fireEvent.click(profileImage)
    const userDropdown = screen.getByRole('button', { name: /cerrar sesión/i }).closest('.user-dropdown-menu')
    expect(userDropdown).toHaveClass('open')

    // 2. Hacer click en Cerrar sesión
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i })
    await fireEvent.click(logoutButton)

    // 3. Verificaciones
    // a) Debe navegar a la página de login
    expect(goto).toHaveBeenCalledWith('../../auth/login')
    // b) El menú de usuario debe cerrarse
    await waitFor(() => {
      expect(userDropdown).not.toHaveClass('open')
    })
  })

  // --- Test 6: Actualización de activeTab al hacer click en los enlaces ---

  it('debe actualizar activeTab y la clase "active" al hacer click en un enlace', async () => {
    render(Header)

    // 1. Obtener el contenedor de la navegación principal
    const primaryNav = screen.getByRole('navigation')

    // 2. Restringir la búsqueda a la navegación principal (primaryNav)
    const menuLink = within(primaryNav).getByRole('link', { name: /menú/i })
    const ingredientsLink = within(primaryNav).getByRole('link', { name: /ingredientes/i })

    // 1. Estado inicial (simulado por el mockLocation): Menu activo
    await waitFor(() => {
      expect(menuLink).toHaveClass('active')
      expect(ingredientsLink).not.toHaveClass('active')
    })

    // 2. Click en 'Ingredientes'
    await fireEvent.click(ingredientsLink)

    // 3. Verificación de la actualización de la clase 'active'
    await waitFor(() => {
      expect(ingredientsLink).toHaveClass('active')
      expect(menuLink).not.toHaveClass('active')
    })
  })

})
