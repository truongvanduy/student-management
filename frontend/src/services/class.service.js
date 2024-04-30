import createApiClient from './api.service'

class StudentService {
  constructor() {
    this.api = createApiClient('/api/class')
  }

  async getAll(query) {
    return (await this.api.get(`/`, { params: query })).data
  }

  async getScores(query) {
    return (await this.api.get(`/score/edit`, { params: query })).data
  }

  async updateScores(scores) {
    return (await this.api.post(`/score/edit`, scores)).data
  }

  async viewScores(filter) {
    return (await this.api.get(`/score`, { params: filter })).data
  }
}
export default new StudentService()
