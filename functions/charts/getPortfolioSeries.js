const getPortfolioSeries = (pricedAssets, floorSnapshots, isMonth) => {
  const days = isMonth ? 30 : 7
  const pricedAssetsArr = Object.values(pricedAssets)
  const snapshots = [...floorSnapshots]

  const totalBoughtSeries = {
    name: 'Investment Value',
    data: new Array(days).fill(null),
  }
  const totalHighestTraitSeries = {
    name: 'Highest Trait Value',
    data: new Array(days).fill(null),
  }
  const totalFloorSeries = {
    name: 'Floor Value',
    data: new Array(days).fill(null),
  }

  if (isMonth) {
    while (snapshots.length < 30) snapshots.unshift({})
    while (snapshots.length > 30) snapshots.shift()
  } else {
    while (snapshots.length < 7) snapshots.unshift({})
    while (snapshots.length > 7) snapshots.shift()
  }

  const isTimestampValid = (idx, timestamp) => {
    const thisStamp = snapshots[snapshots.length - (days - idx)]?.timestamp

    if (thisStamp >= timestamp || thisStamp === 'LIVE') {
      return true
    }

    return false
  }

  const getTotalValuesForAttributesAtThisDate = (itemAttributes, idx) => {
    let floor = 0
    let highestTrait = 0

    Object.entries(snapshots[idx]?.attributes ?? {}).forEach(([category, traits]) => {
      const v = traits[itemAttributes[category]]

      if (v) {
        if (highestTrait < v) {
          highestTrait = v
        }

        if (floor === 0 || floor > v) {
          floor = v
        }
      }
    })

    return { floor, highestTrait }
  }

  pricedAssetsArr.forEach(({ attributes, price, timestamp }) => {
    if (attributes) {
      totalBoughtSeries.data = totalBoughtSeries.data.map((num, i) => {
        if (isTimestampValid(i, timestamp)) return Math.round(num + price)
        return num
      })

      totalHighestTraitSeries.data = totalHighestTraitSeries.data.map((num, i) => {
        if (isTimestampValid(i, timestamp))
          return Math.round(num + getTotalValuesForAttributesAtThisDate(attributes, i).highestTrait)
        return num
      })

      totalFloorSeries.data = totalFloorSeries.data.map((num, i) => {
        if (isTimestampValid(i, timestamp))
          return Math.round(num + getTotalValuesForAttributesAtThisDate(attributes, i).floor)
        return num
      })
    }
  })

  return [totalBoughtSeries, totalHighestTraitSeries, totalFloorSeries]
}

module.exports = getPortfolioSeries
