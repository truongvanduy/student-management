export default function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Có lỗi xảy ra'
}
