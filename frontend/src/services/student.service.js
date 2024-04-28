import createApiClient from './api.service'

class StudentService {
  constructor() {
    this.api = createApiClient('/api/student')
  }

  async getAll() {
    return (await this.api.get(`/`)).data
  }

  async getByEmail(email) {
    return await this.api.get(`?email=${email}`)
  }

  async getProfile(id) {
    return (await this.api.get(`/profile/${id}`)).data
  }

  async getScores(filter) {
    return (await this.api.get(`/score`, { params: filter })).data
  }

  async create() {
    return (await this.api.get(`/create`)).data
  }

  async store(data) {
    return (await this.api.post(`/create`, data)).data
  }

  async edit(id) {
    return (await this.api.get(`/edit/${id}`)).data
  }

  async update(id, data) {
    return (await this.api.patch(`/edit/${id}`, data)).data
  }

  async delete(id) {
    return (await this.api.delete(`/delete/${id}`)).data
  }
}
export default new StudentService()
