export class Ingredient {
   id: number
   name: string
   price: number
   group: string
   animalOrigin: boolean

   constructor(
      id?: number,
      name?: string,
      price?: number,
      group?: string,
      animalOrigin?: boolean
   ) {
      this.id = id ?? 0
      this.name = name ?? ''
      this.price = price ?? 0
      this.group = group ?? ''
      this.animalOrigin = animalOrigin ?? false
   }
}
