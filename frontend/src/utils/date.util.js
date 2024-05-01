export function toDMY(yyyymmddString, separator = '/') {
  if (!yyyymmddString) return ''
  const [year, month, day] = yyyymmddString.split('-')
  return day + separator + month + separator + year
}
