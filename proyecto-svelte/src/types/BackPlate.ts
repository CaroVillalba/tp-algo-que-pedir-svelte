import type { Ingredient } from './Ingredient'

export interface BackPlate {
  imageURL: string,
  name: string,
  description: string,
  ingredients: Ingredient[],
  local: number,
  agreedPercentageWithLocal: number,
  authorRoyalties: number,
  baseValue: number,
  discount: number,
  productionCost: number,
  authorPlate?: boolean,
  promoted?: boolean,
  releaseDate?: string
}