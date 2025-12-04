import type { Ingredient } from './Ingredient'

export interface Dish {
    id: number
    name: string
    description: string
    imageUrl: string
    authorPlate: boolean
    promoted: boolean
    ingredients: Ingredient[]
    quantity: number
    price: number
    cant: number
}

