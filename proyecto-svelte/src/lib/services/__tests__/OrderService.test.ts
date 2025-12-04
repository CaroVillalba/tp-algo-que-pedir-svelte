// tests/OrderService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { orderService } from '../OrderService'
import axios from 'axios'
import type { Order } from '../../../types/Order'

vi.mock('axios')

const mockedAxios = axios as unknown as {
  get: (...args: any[]) => Promise<any>
  patch: (...args: any[]) => Promise<any>
  delete: (...args: any[]) => Promise<any>
}

describe('OrderService', () => {
  beforeEach(() => {
    mockedAxios.get = vi.fn()
    mockedAxios.patch = vi.fn()
    mockedAxios.delete = vi.fn()
  })

  const apiRoot = 'http://localhost:9000/v1'
  const token = 'MOCK_VALID_TOKEN'

  const mockOrder: Order = {
    id: 1,
    comission: 5,
    increment: 0,
    user: { id: 10, name: 'Juan', surname: 'Pérez', username: 'jperez', mail: 'j@p.com', password: '123' },
    time: '12:00',
    dishes: [],
    direction: { street: 'Falsa', number: '123', coordinates: { x: -34.6, y: -58.4 } },
    paymentMethod: 'EFECTIVO',
    quantity: 2,
    subtotal: 100,
    total: 105,
    state: 'PENDIENTE'
  }

  // ────────────────────────────────────────────────
  // Casos exitosos
  // ────────────────────────────────────────────────

  it('getAllOrder debería hacer GET con header Authorization y devolver los datos', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [mockOrder] })

    const result = await orderService.getAllOrder(token)

    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiRoot}/order`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    expect(result).toEqual([mockOrder])
  })

  it('getByIdOrderDetail debería hacer GET a /order/orderDetail/:id y devolver los datos', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockOrder })

    const result = await orderService.getByIdOrderDetail(1)

    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiRoot}/order/orderDetail/1`)
    expect(result).toEqual(mockOrder)
  })

  it('getByStateOrder debería hacer GET con params de estado y devolver los datos', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [mockOrder] })

    const result = await orderService.getByStateOrder('PENDIENTE')

    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiRoot}/order`, {
      params: { state: 'PENDIENTE' }
    })
    expect(result).toEqual([mockOrder])
  })

  it('updateOrderState debería hacer PATCH al endpoint correcto y devolver el pedido actualizado', async () => {
    const updatedOrder = { ...mockOrder, state: 'PREPARADO' }
    mockedAxios.patch = vi.fn().mockResolvedValue({ data: updatedOrder })

    const result = await orderService.updateOrderState(mockOrder.id)

    expect(mockedAxios.patch).toHaveBeenCalledWith(`${apiRoot}/order/1`)
    expect(result).toEqual(updatedOrder)
  })

  it('deleteOrder debería hacer DELETE al endpoint correcto y devolver la respuesta', async () => {
    mockedAxios.delete = vi.fn().mockResolvedValue({ data: { success: true } })

    const result = await orderService.deleteOrder(mockOrder.id)

    expect(mockedAxios.delete).toHaveBeenCalledWith(`${apiRoot}/order/1`)
    expect(result).toEqual({ success: true })
  })

  // ────────────────────────────────────────────────
  // Casos de error
  // ────────────────────────────────────────────────

  it('getAllOrder debería propagar el error si axios falla', async () => {
    const error = new Error('Network Error')
    mockedAxios.get = vi.fn().mockRejectedValue(error)

    await expect(orderService.getAllOrder(token)).rejects.toThrow('Network Error')
  })

  it('getByIdOrderDetail debería propagar el error si axios falla', async () => {
    const error = new Error('404 Not Found')
    mockedAxios.get = vi.fn().mockRejectedValue(error)

    await expect(orderService.getByIdOrderDetail(999)).rejects.toThrow('404 Not Found')
  })

  it('getByStateOrder debería propagar el error si axios falla', async () => {
    const error = new Error('Internal Server Error')
    mockedAxios.get = vi.fn().mockRejectedValue(error)

    await expect(orderService.getByStateOrder('INVALIDO')).rejects.toThrow('Internal Server Error')
  })

  it('updateOrderState debería propagar el error si axios falla', async () => {
    const error = new Error('Patch failed')
    mockedAxios.patch = vi.fn().mockRejectedValue(error)

    await expect(orderService.updateOrderState(1)).rejects.toThrow('Patch failed')
  })

  it('deleteOrder debería propagar el error si axios falla', async () => {
    const error = new Error('Delete failed')
    mockedAxios.delete = vi.fn().mockRejectedValue(error)

    await expect(orderService.deleteOrder(1)).rejects.toThrow('Delete failed')
  })
})
