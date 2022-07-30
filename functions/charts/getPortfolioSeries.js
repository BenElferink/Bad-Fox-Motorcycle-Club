const getPortfolioSeries = (pricedAssets, floorData, isMonth) => {
  const pricedAssetsArr = Object.values(pricedAssets)

  const totalFloorSeries = {
    name: `Total Floors for ${pricedAssetsArr.length} Assets`,
    data: new Array(isMonth ? 30 : 7).fill(null),
  }
  const totalBoughtSeries = {
    name: `Total Expenses for ${pricedAssetsArr.length} Assets`,
    data: new Array(isMonth ? 30 : 7).fill(null),
  }

  pricedAssetsArr.forEach(({ gender, price, timestamp }) => {
    if (gender) {
      const floorForThisGender = floorData[gender]

      if (isMonth) {
        while (floorForThisGender.length < 30) floorForThisGender.unshift({ price: 0 })
        while (floorForThisGender.length > 30) floorForThisGender.shift()
      } else {
        while (floorForThisGender.length < 7) floorForThisGender.unshift({ price: 0 })
        while (floorForThisGender.length > 7) floorForThisGender.shift()
      }

      const isTimestampValid = (idx) => {
        const thisStamp = floorForThisGender[floorForThisGender.length - ((isMonth ? 30 : 7) - idx)]?.timestamp

        if (thisStamp === 'LIVE' || thisStamp >= timestamp) {
          return true
        }

        return false
      }

      totalFloorSeries.data = totalFloorSeries.data.map((num, i) => {
        return num + floorForThisGender[i].price
        // if (isTimestampValid(i)) return num + floorForThisGender[i].price
        // return num
      })

      totalBoughtSeries.data = totalBoughtSeries.data.map((num, i) => {
        if (isTimestampValid(i)) return num + price
        return num
      })
    }
  })

  return [totalFloorSeries, totalBoughtSeries]
}

module.exports = getPortfolioSeries
