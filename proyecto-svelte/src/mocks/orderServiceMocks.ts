
import type { ApiResponse } from '../types/Account';
import type { Order } from '../types/Order';
import { plateMock } from './plate';

// observación: el order deberia poder reutilizarse para el order-detail. ver implementacion del ejemplo de paises

export const MOCK_ORDERS: Order[] = [
  {
    // PROPIEDADES NUEVAS REQUERIDAS
    comision: 1.5,
    increment: 0.0,
    // PROPIEDADES EXISTENTES
    id: 1234,
    user: { userName: 'Pedro Aznar', userID: 'pedroaznar', id:1, contraseña:''}, // Asegúrate del tipo User
    hora: new Date(),
    platos: plateMock,
    direction: { direction: 'Av Siempre Viva 555', coordinates: '-40.7128,-74.0060' }, // Asegúrate del tipo Direction
    metodoPago: 'efectivo',
    cantidad: 2,
    total: 19.5,
    subtotal: 18,
    state: 'Entregados'
  },
  {
    comision: 2.0,
    increment: 0.5,
    id: 1235,
    user: { userName: 'Alejandra', userID: 'pisco', id:2, contraseña:'' },
    hora: new Date(),
    platos: plateMock,
    direction: { direction: 'Cuatro de febrero', coordinates: '-50.7128,-64.0060' },
    metodoPago: 'tarjeta',
    cantidad: 2,
    total: 20.5,
    subtotal: 18,
    state: 'Cancelados'
  },
  {
    comision: 0.0,
    increment: 0.0,
    id: 1236,
    user: { userName: 'NoMockeado', userID: 'personaReal', id:3, contraseña:'' },
    hora: new Date(),
    platos: plateMock,
    direction: { direction: 'Calle Falsa 123', coordinates: '-60.7128,-74.0060' },
    metodoPago: 'transferencia',
    cantidad: 2,
    total: 18,
    subtotal: 18,
    state: 'Pendientes'
  }
];

export async function getOrdersMock(token: string): Promise<ApiResponse<Order[]>> {

  if (token === 'invalid-token') {
    return { success: false, data: null, message: 'Token inválido. Usando Mock.' }
  }

  return { success: true, data: MOCK_ORDERS }
}

export async function getOrderByIDMock(id: number): Promise<Order> {

  const order = MOCK_ORDERS.find(order => order.id === id) 
  if (!order) throw new Error('No se encontró el pedido con el ID proporcionado.')
  return order

}

export async function getOrderByState(state: string): Promise<Order[]>{
  const order = MOCK_ORDERS.filter(order => order.state === state)
  return order 
}


//esta funcion la usaria order-detail

export async function updateOrderMock(token: string, order: Order): Promise<ApiResponse<Order>> {

  if (token === 'invalid-token') {
    return { success: false, data: null, message: 'Token inválido. Usando Mock.' }
  }
  return { success: true, data: order, message: 'Pedido actualizado exitosamente' }
}
/*
  getHora(): string {
    return this.hora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  cantidad(): number {
    return this.platos.length
  }

  subtotal(): number {
    return this.platos.reduce((total, plato) => total + plato.price, 0)
  }

  total(): number {
    const subtotal = this.subtotal()
    const comision = this.comision || 0
    const increment = this.increment || 0
    return subtotal + comision + increment
  }
*/