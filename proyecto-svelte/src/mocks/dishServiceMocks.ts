import type { Dish } from '../types/Dish'
import type { ApiResponse } from '../types/Account'

const MOCK_DISH: Dish[] = [{
  id: 1,
  name: 'Hamburguesa con Mock',
  description: 'Hamburguesa clásica con Mock y papas fritas',
  cant: 1,
  price: 12,
  imageUrl: '../images/hamburguesa-plato.png',
  authorPlate: false,
  promoted: false,
  ingredients: []
}, {
  id: 2,
  name: 'Papas fritas Mock',
  description: 'Tradicionales papas fritas crocantes y mockeadas',
  cant: 1,
  price: 5,
  imageUrl: '../images/papas-fritas.png',
  authorPlate: false,
  promoted: false,
  ingredients: []
}, {
  id: 3,
  name: 'Refresco Mock',
  description: 'Jugo natural de fruta mockeada',
  cant: 1,
  price: 3,
  imageUrl: '../images/jugo-fruta.png',
  authorPlate: false,
  promoted: false,
  ingredients: []
}]

export async function getDishesMock(token: string): Promise<ApiResponse<Dish[]>> {

  if (token === 'invalid-token') {
    return { success: false, data: null, message: 'Token inválido. Usando Mock.' }
  }

  return { success: true, data: MOCK_DISH }
}

export async function createDishMock(token: string, dish: Dish): Promise<ApiResponse<Dish>> {

  if (token === 'invalid-token') {
    return { success: false, data: null, message: 'Token inválido. Usando Mock.' }
  }
  if (dish.price < 0) {
    return { success: false, data: null, message: 'El precio no puede ser negativo. (Mock Error)' }
  }
  return { success: true, data: dish, message: 'Plato creado exitosamente' }
}