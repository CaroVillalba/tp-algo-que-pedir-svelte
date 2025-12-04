import { describe, it, expect, beforeEach, vi } from 'vitest'
import { accountService } from '../AccountService'
import axios from 'axios'
import type { LocalAccount } from '../../../types/Account'

vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: (...args: any[]) => Promise<any>
  put: (...args: any[]) => Promise<any>
}

describe('AccountService', () => {
  beforeEach(() => {
    mockedAxios.get = vi.fn()
    mockedAxios.put = vi.fn()
  })

  const mockLocalAccountDTO = {
    id: 1,
    name: 'Mi Local',
    imgURL: 'http://example.com/img.png',
    address: {
      street: 'Calle Falsa',
      number: '123',
      coordinates: { x: -34.6, y: -58.4 }
    },
    appCommission: 10,
    authorCommission: 5,
    paymentMethods: ['EFECTIVO', 'QR']
  }

  const expectedLocalAccount: LocalAccount = {
    name: 'Mi Local',
    imgURL: 'http://example.com/img.png',
    street: 'Calle Falsa',
    number: 123,
    latitude: -34.6,
    longitude: -58.4,
    appCommission: 10,
    authorCommission: 5,
    paymentMethods: ['EFECTIVO', 'QR']
  }

  it('getLocalAccount debería mapear correctamente', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockLocalAccountDTO })

    const result = await accountService.getLocalAccount()
    expect(result).toEqual(expectedLocalAccount)
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9000/v1/local/1')
  })

  it('updateLocalAccount debería enviar PUT con payload correcto', async () => {
    const localAccount: LocalAccount = { ...expectedLocalAccount }

    mockedAxios.put = vi.fn().mockResolvedValue({ status: 204 })

    await accountService.updateLocalAccount(localAccount)

    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:9000/v1/local/1',
      {
        name: localAccount.name,
        imgURL: localAccount.imgURL,
        address: {
          street: localAccount.street,
          number: localAccount.number.toString(),
          coordinates: { x: localAccount.latitude, y: localAccount.longitude }
        },
        appCommission: localAccount.appCommission,
        authorCommission: localAccount.authorCommission,
        paymentMethods: localAccount.paymentMethods.map((m) => m.toUpperCase())
      }
    )
  })
})
