const formatBigNumber = (num) => {
  const strNum = String(num)

  // thousands (k)
  if ((num >= 1000 && num <= 999999) || (num <= -1000 && num >= -999999)) {
    return `${strNum.substring(0, strNum.length - 3)}.${strNum.substring(
      strNum.length - 3,
      strNum.length - 2,
    )}k`
  }

  // millions (m)
  if ((num >= 1000000 && num <= 999999999) || (num <= -1000000 && num >= -999999999)) {
    return `${strNum.substring(0, strNum.length - 6)}.${strNum.substring(
      strNum.length - 6,
      strNum.length - 5,
    )}m`
  }

  // billions (b)
  if ((num >= 1000000000 && num <= 999999999999) || (num <= -1000000000 && num >= -999999999999)) {
    return `${strNum.substring(0, strNum.length - 6)}.${strNum.substring(
      strNum.length - 6,
      strNum.length - 5,
    )}b`
  }

  return strNum
}

module.exports = formatBigNumber
