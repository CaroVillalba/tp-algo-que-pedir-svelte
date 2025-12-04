import type { Plate } from '../types/Plate';
import type { ApiResponse } from '../types/Account';
import type { Ingredient } from '../types/Ingredient';

// 1. Definición RAW de Ingredientes (Ahora incluye 'actions: []')
const MOCK_RAW_INGREDIENTS: Ingredient[] = [
  { 
    id: 1, 
    name: 'Pasta', 
    price: 5.50, 
    group: 'Carbohidratos', 
    animalOrigin: false, 
    actions: [] 
  },
  { 
    id: 2, 
    name: 'Salsa Pesto', 
    price: 3.00, 
    group: 'Salsas', 
    animalOrigin: false, 
    actions: [] 
  },
  { 
    id: 3, 
    name: 'Tomates Cherry', 
    price: 1.50, 
    group: 'Vegetales', 
    animalOrigin: false, 
    actions: [] 
  },
];

// 2. Definición RAW de Plato (Ya es un objeto literal)
const MOCK_RAW_PLATE = {
  id: 10,
  name: 'Spaghetti al Pesto',
  description: 'Pasta con salsa pesto casera y tomates cherry frescos.',
  url: '/plato/spaghetti-al-pesto',
  imageUrl: 'https://picsum.photos/300/200?random=1',
  authorPlate: true,
  promoted: false,
  ingredients: MOCK_RAW_INGREDIENTS, // Ya usa el array de objetos literales
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getPlatesMock(
  token: string
): Promise<ApiResponse<Plate>> {
  await delay(700)

  if (token === 'invalid-token') {
    return { success: false, data: null, message: 'Token inválido. Usando Mock.' }
  }
  
  // 3. ¡ELIMINAMOS LA LÓGICA DEL CONSTRUCTOR!
  // Como MOCK_RAW_PLATE ya es un objeto literal que cumple con la interfaz Plate,
  // y sus 'ingredients' ya cumplen con la interfaz Ingredient,
  // simplemente devolvemos MOCK_RAW_PLATE.
  
  // Asumimos que la interfaz Plate tiene esta forma:
  const plateResult: Plate = MOCK_RAW_PLATE as Plate;

  return { success: true, data: plateResult };
}