import createApiClient from './api.service'

class StudentService {
  constructor() {
    this.api = createApiClient('/api/homeroom')
  }

  async index(query) {
    return (await this.api.get(`/`, { params: query })).data
  }

  async getResultStatistics(query) {
    return (await this.api.get(`/statistics`, { params: query })).data
  }

  async getStudents(query) {
    return (await this.api.get(`/students`, { params: query })).data
  }

  async getStudentScores(id, query) {
    return (await this.api.get(`/students/${id}/scores`, { params: query })).data
  }

  async getConducts(query) {
    return (await this.api.get(`/students/conducts`, { params: query })).data
  }
}
export default new StudentService()
