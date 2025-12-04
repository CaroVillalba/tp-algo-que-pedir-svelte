import type { LocalAccount } from '../../types/Account'
import axios from 'axios'

export class AccountService {
  private apiRoot = 'http://localhost:9000/v1'

  async getLocalAccount(): Promise<LocalAccount> {
    const localIdStr = sessionStorage.getItem('localId')
    const localId = Number(localIdStr)

    if (!localIdStr || isNaN(localId) || localId <= 0) {
      // primera vez, devuelve un local vacío
      return {
        id: 0,
        name: '',
        imgURL: '',
        street: '',
        number: 0,
        latitude: 0,
        longitude: 0,
        appCommission: 0,
        authorCommission: 0,
        paymentMethods: []
      }
    }

    const response = await axios.get(`${this.apiRoot}/local/admin/${localId}`)
    const dto = response.data

    return {
      id: dto.id,
      name: dto.name,
      imgURL: dto.imgURL,
      street: dto.address.street,
      number: parseInt(dto.address.number, 10),
      latitude: dto.address.coordinates.x,
      longitude: dto.address.coordinates.y,
      appCommission: dto.appCommission,
      authorCommission: dto.authorCommission,
      paymentMethods: dto.paymentMethods
    }
  }

  async saveLocalAccount(data: LocalAccount): Promise<void> {
    const payload = {
      name: data.name,
      imgURL: data.imgURL,
      address: {
        street: data.street,
        number: data.number.toString(),
        coordinates: {
          x: data.latitude,
          y: data.longitude
        }
      },
      appCommission: data.appCommission,
      authorCommission: data.authorCommission,
      paymentMethods: data.paymentMethods.map((m) => m.toUpperCase())
    }

    const localIdStr = sessionStorage.getItem('localId')
    const localId = localIdStr ? Number(localIdStr) : 0
    const userIdStr = sessionStorage.getItem('userId')
    if (!userIdStr) throw new Error('No hay usuario logueado para asignar el local')
    const userId = Number(userIdStr)

    if (localId > 0) {
      await axios.put(`${this.apiRoot}/local/${localId}`, payload)
    } else {
      const response = await axios.post(`${this.apiRoot}/local/admin`, payload)
      const newLocalId = response.data.id
      if (!newLocalId || newLocalId <= 0) {
        throw new Error('No se pudo obtener el ID del local creado')
      }
      sessionStorage.setItem('localId', newLocalId.toString())

      // Asociar al usuario
      await axios.put(`${this.apiRoot}/auth/${userId}/assign-local/${newLocalId}`)
    }
  }
}

export const accountService = new AccountService()
