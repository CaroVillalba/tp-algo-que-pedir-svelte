import type { Ingredient } from "../../types/Ingredient"
import { CRUDService } from "./CRUDService"


export class IngredientService extends CRUDService<Ingredient> {
  constructor() {
    super('ingredients')
  }
  /*async getAll(token: string): Promise<Ingredient[]>{
    const response = await axios.get(`${this.apiRoot}/${this.path}/menu`, {
      headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
  }*/

}
export const ingredientService = new IngredientService()


