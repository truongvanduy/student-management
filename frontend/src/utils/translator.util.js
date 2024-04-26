const dictionary = {
  student: 'học sinh',
  teacher: 'giáo viên',
  admin: 'quản trị viên'
}

export function translate(orgString) {
  return dictionary[orgString] || orgString
}
