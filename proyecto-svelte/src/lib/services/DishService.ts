import type { BackPlate } from '../../types/BackPlate'
import type { Dish } from '../../types/Dish'
import type { Ingredient } from '../../types/Ingredient'
import { CRUDService } from './CRUDService'
import axios from 'axios'

export class DishService extends CRUDService<Dish> {
  constructor() {
    super('dishes')
  }

  async getByLocal(localId: number): Promise<Dish[]> {
    const response = await axios.get(`${this.apiRoot}/${this.path}/local/${localId}`)
    return response.data
  }

  async createDishes(ingredient: Ingredient[], data: BackPlate) {
    const localId = Number(sessionStorage.getItem('localId'))
    const payload = {
      imageURL: data.imageURL,
      name: data.name,
      description: data.description,
      ingredients: ingredient,
      local: localId,
      agreedPercentageWithLocal: data.agreedPercentageWithLocal,
      authorRoyalties: data.authorRoyalties,
      baseValue: data.baseValue,
      discount: data.discount,
    }

    await axios.post(`${this.apiRoot}/${this.path}`, payload)
  }

  async getByID(id: number | string): Promise<BackPlate> {
    const response = await axios.get(`${this.apiRoot}/${this.path}/${id}`)
    return response.data
  }

  async updateDish(data: BackPlate, id: number): Promise<void> {
    const localId = Number(sessionStorage.getItem('localId'))
    const payload = {
      imageURL: data.imageURL,
      name: data.name,
      description: data.description,
      ingredients: data.ingredients,
      local: localId,
      agreedPercentageWithLocal: data.agreedPercentageWithLocal,
      authorRoyalties: data.authorRoyalties,
      baseValue: data.baseValue,
      discount: data.discount,
    }
    await axios.put(`${this.apiRoot}/${this.path}/${id}`, payload)
  }
}
export const dishService = new DishService()


