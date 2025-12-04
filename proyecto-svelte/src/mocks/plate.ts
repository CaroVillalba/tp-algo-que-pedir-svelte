import { Plate } from '../types/Plate'
import { ingredientsMock } from './ingredients'

export const plateMock = [
  new Plate(
    1,
    'Hamburguesa con Queso',
    'Hamburguesa clásica con queso y papas fritas',
    '',
    '/images/hamburguesa-plato.png',
    false,
    false,
    [
      ingredientsMock[0],
      ingredientsMock[1],
      ingredientsMock[2]
    ], 1, 850
  ),
  new Plate(
    2,
    'Papas fritas',
    'Tradicionales papas fritas crocantes',
    '',
    '/images/papas-fritas.png',
    false,
    false,
    [
      ingredientsMock[3]
    ], 1, 300
  ),
  new Plate(
    3,
    'Refresco',
    'Jugo natural de fruta',
    '',
    '/images/jugo-fruta.png',
    false,
    false,
    [
      ingredientsMock[4]
    ], 1, 200
  ),
  new Plate(
    4,
    'Pizza Margarita',
    'Pizza clásica con queso, tomate y albahaca',
    '',
    '/images/pizza-margarita.png',
    false,
    false,
    [
      ingredientsMock[5],
      ingredientsMock[6],
      ingredientsMock[7]
    ], 1, 850
  ),
  new Plate(
    5,
    'Ensalada César',
    'Lechuga, pollo, croutons y aderezo César',
    '',
    '/images/ensalada-cesar.png',
    false,
    false,
    [
      ingredientsMock[8],
      ingredientsMock[9],
      ingredientsMock[10]
    ], 1, 450
  )
]
