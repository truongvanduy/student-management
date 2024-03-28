import createApiClient from './api.service'

class CourseService {
  constructor() {
    this.api = createApiClient('/api/courses')
  }

  async getAll() {
    return (await this.api.get('/')).data
  }
}
export default new CourseService()
