import type { User } from './User'
import type { Direction } from './Direction'
import type { Dish } from './Dish'


export type paymentMethod = 'BITCOIN' | 'CREDITO' | 'DEBITO' | 'EFECTIVO' | 'QR' | 'TRANSFERENCIA'

export interface Order {
     comission: number
     increment: number
     id: number,
     user: User,
     time: string,
     dishes: Dish[],
     direction: Direction,
     paymentMethod: paymentMethod
     quantity: number
     total: number
     subtotal: number
     state: string
}