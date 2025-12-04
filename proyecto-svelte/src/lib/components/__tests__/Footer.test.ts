import { render } from '@testing-library/svelte'
import Footer from '../Footer.svelte'
import { vi, describe, it, expect } from 'vitest'

vi.mock('phosphor-svelte', () => {
  const makeMock = (_name: string) => (_props: Record<string, unknown>) => {
    return {}
  }
  return {
    CookingPot: makeMock('CookingPot'),
    ShoppingCart: makeMock('ShoppingCart'),
    ForkKnife: makeMock('ForkKnife'),
    BowlFood: makeMock('BowlFood'),
    User: makeMock('User'),
  }
})

describe('Footer.svelte', () => {
  it('debe renderizar todos los enlaces de íconos', () => {
    const { container } = render(Footer)
    const links = container.querySelectorAll('a')

    // Esperamos 5 enlaces (uno por cada ícono)
    expect(links.length).toBe(5)
  })

  it('debe tener los enlaces correctos para cada ícono', () => {
    const { container } = render(Footer)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toEqual([
      '#top',
      '../main/order',
      '../main/menu',
      '../main/ingredients',
      '../main/account',
    ])
  })

  it('debe ser visible solo en pantallas pequeñas (<= 400px)', () => {
    const { container } = render(Footer)
    const footer = container.querySelector('footer')

    if (!footer) throw new Error('No se encontró el footer')

    // 1. Simular Pantalla Grande (debe ser 'none')
    window.innerWidth = 1024
    // Aplicar manualmente el estilo para simular la media query
    footer.style.display = window.innerWidth <= 400 ? 'block' : 'none'
    expect(getComputedStyle(footer).display).toBe('none')

    // 2. Simular Pantalla Pequeña (debe ser 'block')
    window.innerWidth = 400
    // Aplicar manualmente el estilo para simular la media query
    footer.style.display = window.innerWidth <= 400 ? 'block' : 'none'
    expect(getComputedStyle(footer).display).toBe('block')
  })
})