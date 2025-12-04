// tests/DishService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { dishService } from '../DishService'
import axios from 'axios'
import type { Dish } from '../../../types/Dish'
import type { BackPlate } from '../../../types/BackPlate'
import type { Ingredient } from '../../../types/Ingredient'

vi.mock('axios')

const mockedAxios = axios as unknown as {
  get: (...args: any[]) => Promise<any>
  post: (...args: any[]) => Promise<any>
  put: (...args: any[]) => Promise<any>
}

describe('DishService', () => {
  beforeEach(() => {
    mockedAxios.get = vi.fn()
    mockedAxios.post = vi.fn()
    mockedAxios.put = vi.fn()
  })

  const apiRoot = 'http://localhost:9000/v1'

  const exampleIngredients: Ingredient[] = [
    { id: 1, name: 'Tomate', price: 50, group: 'Verdura', animalOrigin: false },
    { id: 2, name: 'Mozzarella', price: 100, group: 'Lácteo', animalOrigin: true }
  ]

  const exampleBackPlate: BackPlate = {
    imageURL: 'http://img.com/pizza.jpg',
    name: 'Pizza Margarita',
    description: 'Clásica',
    ingredients: exampleIngredients,
    local: 1,
    agreedPercentageWithLocal: 20,
    authorRoyalties: 10,
    baseValue: 1000,
    discount: 0,
    productionCost: 0
  }

  const exampleDish: Dish = {
    id: 1,
    name: 'Pizza Margarita',
    description: 'Clásica',
    imageUrl: 'http://img.com/pizza.jpg',
    authorPlate: true,
    promoted: false,
    ingredients: exampleIngredients,
    quantity: 1,
    price: 1200,
    cant: 1
  }

  // ────────────────────────────────────────────────
  // Casos exitosos
  // ────────────────────────────────────────────────

  it('getAllMenu debería hacer GET y devolver la lista de platos', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [exampleDish] })

    const result = await dishService.getAllMenu()

    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiRoot}/dishes`)
    expect(result).toEqual([exampleDish])
  })

  it('createDishes debería enviar POST con el payload correcto', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ status: 201 })

    await dishService.createDishes(exampleIngredients, exampleBackPlate)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${apiRoot}/dishes`,
      {
        imageURL: exampleBackPlate.imageURL,
        name: exampleBackPlate.name,
        description: exampleBackPlate.description,
        ingredients: exampleIngredients,
        local: 1,
        agreedPercentageWithLocal: exampleBackPlate.agreedPercentageWithLocal,
        authorRoyalties: exampleBackPlate.authorRoyalties,
        baseValue: exampleBackPlate.baseValue,
        discount: exampleBackPlate.discount
      }
    )
  })

  it('getByID debería hacer GET a /dishes/:id y devolver el plato (BackPlate)', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: exampleBackPlate })

    const result = await dishService.getByID(1)

    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiRoot}/dishes/1`)
    expect(result).toEqual(exampleBackPlate)
  })

  it('updateDish debería hacer PUT con el payload correcto al id indicado', async () => {
    mockedAxios.put = vi.fn().mockResolvedValue({ status: 204 })

    const dataToUpdate: BackPlate = {
      ...exampleBackPlate,
      name: 'Pizza Actualizada',
      ingredients: exampleIngredients
    }

    await dishService.updateDish(dataToUpdate, 42)

    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${apiRoot}/dishes/42`,
      {
        imageURL: dataToUpdate.imageURL,
        name: dataToUpdate.name,
        description: dataToUpdate.description,
        ingredients: dataToUpdate.ingredients,
        local: 1,
        agreedPercentageWithLocal: dataToUpdate.agreedPercentageWithLocal,
        authorRoyalties: dataToUpdate.authorRoyalties,
        baseValue: dataToUpdate.baseValue,
        discount: dataToUpdate.discount
      }
    )
  })

  // ────────────────────────────────────────────────
  // Casos de error
  // ────────────────────────────────────────────────

  it('getAllMenu debería propagar el error si axios falla', async () => {
    const error = new Error('Network Error')
    mockedAxios.get = vi.fn().mockRejectedValue(error)

    await expect(dishService.getAllMenu()).rejects.toThrow('Network Error')
  })

  it('createDishes debería propagar el error si axios falla', async () => {
    const error = new Error('POST failed')
    mockedAxios.post = vi.fn().mockRejectedValue(error)

    await expect(dishService.createDishes(exampleIngredients, exampleBackPlate)).rejects.toThrow(
      'POST failed'
    )
  })

  it('getByID debería propagar el error si axios falla', async () => {
    const error = new Error('404 Not Found')
    mockedAxios.get = vi.fn().mockRejectedValue(error)

    await expect(dishService.getByID(999)).rejects.toThrow('404 Not Found')
  })

  it('updateDish debería propagar el error si axios falla', async () => {
    const error = new Error('PUT failed')
    mockedAxios.put = vi.fn().mockRejectedValue(error)

    await expect(dishService.updateDish(exampleBackPlate, 1)).rejects.toThrow('PUT failed')
  })
})
