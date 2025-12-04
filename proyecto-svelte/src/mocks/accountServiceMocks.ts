import type { LocalAccount, ApiResponse } from '../types/Account'

const MOCK_LOCAL_ACCOUNT: LocalAccount = {
  name: 'Local Demo Mock',
  description: 'sdflñkgsñdlglñdskgñlfsdkgsdkgfkdslñgksldfgkñlsdkgldsflñ',
  imgURL: 'https://picsum.photos/300/200',
  address: 'Calle Falsa 123',
  cost: 15,
  height: 50,
  latitude: 40.7128,
  longitude: -74.0060,
  comisionApp: 15,
  comisionAuthor: 10,
  paymentMethods: ['efectivo', 'qr'],
  author_plate: false,
  promotion: true,
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getLocalAccountMock(token: string): Promise<ApiResponse<LocalAccount>> {
  await delay(500)

  if (token === 'invalid-token') {
    return { success: false, data: null, message: 'Token inválido. Usando Mock.' }
  }

  return { success: true, data: MOCK_LOCAL_ACCOUNT }
}

export async function updateLocalAccountMock(
  token: string,
  data: LocalAccount
): Promise<ApiResponse<LocalAccount>> {
  await delay(700)

  if (data.comisionApp > 50) {
    return { success: false, data: data, message: 'La comisión de la app no puede ser mayor al 50%. (Mock Error)' }
  }

  return { success: true, data: MOCK_LOCAL_ACCOUNT, message: 'Actualización exitosa (MOCK)' }
}