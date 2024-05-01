const dictionary = {
  student: 'học sinh',
  teacher: 'giáo viên',
  admin: 'quản trị viên',
  father: 'Cha',
  mother: 'Mẹ',
  guardian: 'Người giám hộ',
  other: 'Khác',
  male: 'Nam',
  female: 'Nữ',
  good: 'Tốt',
  fair: 'Khá',
  average: 'Trung bình',
  weak: 'Yếu'
}

export function translate(orgString) {
  return dictionary[orgString] || orgString
}
