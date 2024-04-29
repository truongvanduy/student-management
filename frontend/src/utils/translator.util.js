const dictionary = {
  student: 'học sinh',
  teacher: 'giáo viên',
  admin: 'quản trị viên',
  father: 'Cha',
  mother: 'Mẹ',
  guardian: 'Người giám hộ',
  other: 'Khác'
}

export function translate(orgString) {
  return dictionary[orgString] || orgString
}
