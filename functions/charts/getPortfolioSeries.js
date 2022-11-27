const getPortfolioSeries = (pricedAssets, floorSnapshots) => {
  const numOfDataPoints = 30
  const pricedAssetsArr = Object.values(pricedAssets)
  const snapshots = [...floorSnapshots]

  const investementValue = {
    label: 'Investment',
    data: new Array(numOfDataPoints).fill(0),
  }
  const floorValue = {
    label: 'Floor',
    data: new Array(numOfDataPoints).fill(0),
  }
  const highestTraitValue = {
    label: 'Highest Trait',
    data: new Array(numOfDataPoints).fill(0),
  }

  while (snapshots.length < numOfDataPoints) snapshots.unshift({})
  while (snapshots.length > numOfDataPoints) snapshots.shift()

  const isTimestampValid = (idx, timestamp) => {
    const thisStamp = snapshots[snapshots.length - (numOfDataPoints - idx)]?.timestamp

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
      investementValue.data = investementValue.data.map((num, i) => {
        if (isTimestampValid(i, timestamp)) return Math.round(num + price)
        return num
      })

      floorValue.data = floorValue.data.map((num, i) => {
        if (isTimestampValid(i, timestamp))
          return Math.round(num + getTotalValuesForAttributesAtThisDate(attributes, i).floor)
        return num
      })

      highestTraitValue.data = highestTraitValue.data.map((num, i) => {
        if (isTimestampValid(i, timestamp))
          return Math.round(num + getTotalValuesForAttributesAtThisDate(attributes, i).highestTrait)
        return num
      })
    }
  })

  investementValue.borderColor = 'rgba(114, 137, 218, 1)'
  investementValue.backgroundColor = 'rgba(114, 137, 218, 0.4)'

  const floorValueIsUp =
    floorValue.data[floorValue.data.findIndex((num) => num !== 0)] < floorValue.data[floorValue.data.length - 1]

  floorValue.borderColor = floorValueIsUp ? 'rgba(68, 183, 0, 1)' : 'rgba(183, 68, 0, 1)'
  floorValue.backgroundColor = floorValueIsUp ? 'rgba(68, 183, 0, 0.4)' : 'rgba(183, 68, 0, 0.4)'

  const highestTraitValueIsUp =
    highestTraitValue.data[highestTraitValue.data.findIndex((num) => num !== 0)] <
    highestTraitValue.data[highestTraitValue.data.length - 1]

  highestTraitValue.borderColor = highestTraitValueIsUp ? 'rgba(68, 183, 0, 1)' : 'rgba(183, 68, 0, 1)'
  highestTraitValue.backgroundColor = highestTraitValueIsUp ? 'rgba(68, 183, 0, 0.4)' : 'rgba(183, 68, 0, 0.4)'

  return [investementValue, floorValue, highestTraitValue]
}

module.exports = getPortfolioSeries
