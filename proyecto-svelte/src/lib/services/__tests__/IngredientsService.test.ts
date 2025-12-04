import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ingredientService } from '../IngredientsService'
import axios from 'axios'
import type { Ingredient } from '../../../types/Ingredient'

vi.mock('axios')

const mockedAxios = axios as unknown as {
  get: (...args: any[]) => Promise<any>
  post: (...args: any[]) => Promise<any>
  put: (...args: any[]) => Promise<any>
  delete: (...args: any[]) => Promise<any>
}

describe('IngredientService', () => {
  beforeEach(() => {
    mockedAxios.get = vi.fn()
    mockedAxios.post = vi.fn()
    mockedAxios.put = vi.fn()
    mockedAxios.delete = vi.fn()
  })

  const apiRoot = 'http://localhost:9000/v1'

  const mockIngredient: Ingredient = {
    id: 1,
    name: 'Harina',
    price: 200,
    group: 'CEREALES_Y_TUBERCULOS',
    animalOrigin: false,
  }

  // ────────────────────────────────────────────────
  // Casos exitosos
  // ────────────────────────────────────────────────

  it('getAll debería hacer GET al endpoint correcto y devolver los ingredientes', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [mockIngredient] })

    const result = await ingredientService.getAll()

    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiRoot}/ingredients`)
    expect(result).toEqual([mockIngredient])
  })

  it('getById debería hacer GET con el id correcto y devolver el ingrediente', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockIngredient })

    const result = await ingredientService.getById(1)

    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiRoot}/ingredients/1`)
    expect(result).toEqual(mockIngredient)
  })

  it('create debería hacer POST con el payload correcto', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ status: 201 })

    await ingredientService.create(mockIngredient)

    expect(mockedAxios.post).toHaveBeenCalledWith(`${apiRoot}/ingredients`, mockIngredient)
  })

  it('update debería hacer PUT con el payload correcto', async () => {
    mockedAxios.put = vi.fn().mockResolvedValue({ status: 204 })

    await ingredientService.update(mockIngredient)

    expect(mockedAxios.put).toHaveBeenCalledWith(`${apiRoot}/ingredients`, mockIngredient)
  })

  it('deleteItem debería hacer DELETE al endpoint correcto', async () => {
    mockedAxios.delete = vi.fn().mockResolvedValue({ status: 204 })

    await ingredientService.deleteItem(mockIngredient.id)

    expect(mockedAxios.delete).toHaveBeenCalledWith(`${apiRoot}/ingredients/1`)
  })

  // ────────────────────────────────────────────────
  // Casos de error
  // ────────────────────────────────────────────────

  it('getAll debería propagar el error si axios falla', async () => {
    const error = new Error('Network Error')
    mockedAxios.get = vi.fn().mockRejectedValue(error)

    await expect(ingredientService.getAll()).rejects.toThrow('Network Error')
  })

  it('getById debería propagar el error si axios falla', async () => {
    const error = new Error('404 Not Found')
    mockedAxios.get = vi.fn().mockRejectedValue(error)

    await expect(ingredientService.getById(999)).rejects.toThrow('404 Not Found')
  })

  it('create debería propagar el error si axios falla', async () => {
    const error = new Error('Create failed')
    mockedAxios.post = vi.fn().mockRejectedValue(error)

    await expect(ingredientService.create(mockIngredient)).rejects.toThrow('Create failed')
  })

  it('update debería propagar el error si axios falla', async () => {
    const error = new Error('Update failed')
    mockedAxios.put = vi.fn().mockRejectedValue(error)

    await expect(ingredientService.update(mockIngredient)).rejects.toThrow('Update failed')
  })

  it('deleteItem debería propagar el error si axios falla', async () => {
    const error = new Error('Delete failed')
    mockedAxios.delete = vi.fn().mockRejectedValue(error)

    await expect(ingredientService.deleteItem(1)).rejects.toThrow('Delete failed')
  })
})
