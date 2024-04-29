export default (user) => {
  if (user && user?.firstName && user?.lastName) {
    return `${user?.lastName} ${user?.firstName}`
  }
  return 'Đang cập nhật'
}
