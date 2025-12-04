import axios from 'axios'

export interface InterfaceService<T> {
  getAll(): Promise<T[]>
  getById(id: number | string): Promise<T>
  create(item: T): Promise<void>
  update(item: T): Promise<void>
  deleteItem(id: number | string): Promise<void>
}

export abstract class CRUDService<T> implements InterfaceService<T> {
  protected apiRoot = 'http://localhost:9000/v1' //protected = private pero utilizable por las clases que heredan CRUD

  constructor(protected path: string) { }

  async getAll(): Promise<T[]> {
    const response = await axios.get(`${this.apiRoot}/${this.path}`)
    return response.data
  }

  async getById(id: number | string): Promise<T> {
    const response = await axios.get(`${this.apiRoot}/${this.path}/${id}`)
    return response.data
  }

  async create(item: T): Promise<void> {
    await axios.post(`${this.apiRoot}/${this.path}`, item)
  }

  async update(item: T): Promise<void> {
    await axios.put(`${this.apiRoot}/${this.path}`, item)
  }

  async deleteItem(id: number | string): Promise<void> {
    await axios.delete(`${this.apiRoot}/${this.path}/${id}`)
  }
}
