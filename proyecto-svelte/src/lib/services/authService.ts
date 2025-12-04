import type { User } from '../../types/User'
import axios from 'axios'
import type { UserCredentialLogin } from '../../types/UserCredentialLogin'
import type { UserCredentialRegister } from '../../types/UserCredentialRegister'


export class AuthService {
  private apiRoot = 'http://localhost:9000/v1'

  async login(credentials: UserCredentialLogin): Promise<User> {
    const response = await axios.get(`${this.apiRoot}/auth/login`, {
      params: credentials,
    })

    const user = response.data

    // si tiene local asignado, guardarlo
    if (user.localId) {
      sessionStorage.setItem('localId', user.localId.toString())
    }

    return user
  }

  async register(credentials: UserCredentialRegister) {

    const payload = {
      name: credentials.name,
      surname: credentials.surname,
      username: credentials.username,
      password: credentials.password,
      birthDate: credentials.birthDate,
      registerDate: credentials.registerDate.toISOString(),
      email: credentials.email
    }


    await axios.post(`${this.apiRoot}/auth/register`, payload)
  }

}
export const authService = new AuthService()

