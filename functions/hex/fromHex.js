const fromHex = (hex) => {
  return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'))
}

export default fromHex
