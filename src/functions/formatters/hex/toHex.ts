const toHex = (txt: string) => {
  const str = String(txt)
  let result = ''

  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16)
  }

  return result
}

export default toHex
