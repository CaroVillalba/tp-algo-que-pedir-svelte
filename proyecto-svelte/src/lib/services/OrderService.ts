import { CRUDService } from './CRUDService'
import type { Order } from '../../types/Order'
import axios from 'axios'


export class OrderService extends CRUDService<Order> {
  constructor() {
    super('order')
  }
  async getAllOrder(token: string): Promise<Order[]> {
    const response = await axios.get(`${this.apiRoot}/${this.path}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  async getByIdOrderDetail(orderId: number): Promise<Order> {
    const response = await axios.get(`${this.apiRoot}/${this.path}/orderDetail/${orderId}`)
    return response.data
  }


  async getByStateOrder(state: string): Promise<Order[]> {
    const response = await axios.get(`${this.apiRoot}/${this.path}`, {
      params: { state }
    })
    return response.data
  }


  async updateOrderState(id: number) {
    const response = await axios.patch(`${this.apiRoot}/${this.path}/${id}`)
    return response.data
  }

  async deleteOrder(id: number) {
    const response = await axios.delete(`${this.apiRoot}/${this.path}/${id}`)
    return response.data
  }

}

export const orderService = new OrderService()
