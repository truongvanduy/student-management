import createApiClient from './api.service'

class YearService {
  constructor() {
    this.api = createApiClient('/api/year')
  }

  async getAll() {
    return (await this.api.get('/')).data
  }
  async getStudentYear() {
    return (await this.api.get('/student')).data
  }
}
export default new YearService()
