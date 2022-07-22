const fromHex = (hex) => {
  return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'))
}

module.exports = fromHex
