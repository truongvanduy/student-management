import createApiClient from './api.service'

class UserService {
  constructor() {
    this.api = createApiClient('/api/user')
  }

  async getByEmail(email) {
    return await this.api.get(`?email=${email}`)
  }

  async getProfile(id) {
    return (await this.api.get(`/profile/${id}`)).data
  }

  async login(data) {
    return await this.api.post(`/login`, data)
  }

  async logout() {
    return await this.api.post(`/logout`)
  }
}
export default new UserService()
