import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthService } from '../AuthService'
import axios from 'axios'
import type { User } from '../../../types/User'
import type { UserCredentialLogin } from '../../../types/UserCredentialLogin'
import type { UserCredentialRegister } from '../../../types/UserCredentialRegister'

vi.mock('axios')

const mockedAxios = axios as unknown as {
  get: (...args: any[]) => Promise<any>
  post: (...args: any[]) => Promise<any>
}

const authService = new AuthService()

const mockUser: User = {
  id: 1,
  username: 'testuser',
  password: 'test',
  name: 'Test',
  surname: 'User',
  mail: 'test@example.com',
}

const loginCredentials: UserCredentialLogin = {
  username: 'testuser',
  password: 'password123',
}

const registerCredentials: UserCredentialRegister = {
  name: 'Test',
  surname: 'User',
  username: 'newuser',
  password: 'securepass',
  birthDate: new Date('1990-01-01'),
  registerDate: new Date('2024-01-01T10:00:00Z'),
  email: 'new@example.com',
}

const expectedPayload = {
  name: 'Test',
  surname: 'User',
  username: 'newuser',
  password: 'securepass',
  birthDate: registerCredentials.birthDate,
  email: 'new@example.com',
  registerDate: registerCredentials.registerDate.toISOString(),
}

describe('AuthService (Vitest)', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    const expectedUrl = 'http://localhost:9000/v1/auth/login'

    it('debería realizar una petición GET con parámetros y retornar el usuario', async () => {
      mockedAxios.get = vi.fn().mockResolvedValue({ data: mockUser })

      const result = await authService.login(loginCredentials)

      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl, {
        params: loginCredentials,
      })
      expect(result).toEqual(mockUser)
    })

    it('debería propagar la excepción si la petición de login falla', async () => {
      const error = new Error('Credenciales inválidas')
      mockedAxios.get = vi.fn().mockRejectedValue(error)

      await expect(authService.login(loginCredentials)).rejects.toThrow(error)
    })
  })

  describe('register', () => {
    const expectedUrl = 'http://localhost:9000/v1/auth/register'

    it('debería realizar una petición POST con el payload correcto', async () => {
      mockedAxios.post = vi.fn().mockResolvedValue({ status: 204 })

      await authService.register(registerCredentials)

      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      expect(mockedAxios.post).toHaveBeenCalledWith(expectedUrl, expectedPayload)
      expect((mockedAxios.post as any).mock.calls[0][1].registerDate).toBe(
        registerCredentials.registerDate.toISOString()
      )
    })

    it('debería propagar la excepción si el registro falla', async () => {
      const error = new Error('El usuario ya existe')
      mockedAxios.post = vi.fn().mockRejectedValue(error)

      await expect(authService.register(registerCredentials)).rejects.toThrow(error)
    })
  })
})
