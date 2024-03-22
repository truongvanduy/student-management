import createApiClient from './api.service'

class StudentService {
  constructor() {
    this.api = createApiClient('/api')
  }

  async getByEmail(email) {
    return await this.api.get(`/student?email=${email}`)
  }

  async login(data) {
    return await this.api.post(`/student/login`, data)
  }

  async logout() {
    return await this.api.post(`/student/logout`)
  }
}
export default new StudentService()
