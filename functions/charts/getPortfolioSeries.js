// https://www.chartjs.org/docs/latest/samples/line/multi-axis.html

const getPortfolioSeries = (pricedAssets, floorSnapshots, isMonth) => {
  const days = isMonth ? 30 : 7
  const pricedAssetsArr = Object.values(pricedAssets)
  const snapshots = [...floorSnapshots]

  const totalBoughtSeries = {
    label: 'Investment Value',
    data: new Array(days).fill(null),
  }
  const totalFloorSeries = {
    label: 'Floor Value',
    data: new Array(days).fill(null),
  }
  const totalHighestTraitSeries = {
    label: 'Highest Trait Value',
    data: new Array(days).fill(null),
  }

  while (snapshots.length < days) snapshots.unshift({})
  while (snapshots.length > days) snapshots.shift()

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

      totalFloorSeries.data = totalFloorSeries.data.map((num, i) => {
        if (isTimestampValid(i, timestamp))
          return Math.round(num + getTotalValuesForAttributesAtThisDate(attributes, i).floor)
        return num
      })

      totalHighestTraitSeries.data = totalHighestTraitSeries.data.map((num, i) => {
        if (isTimestampValid(i, timestamp))
          return Math.round(num + getTotalValuesForAttributesAtThisDate(attributes, i).highestTrait)
        return num
      })
    }
  })

  totalBoughtSeries.borderColor = 'rgba(114, 137, 218, 1)'
  totalBoughtSeries.backgroundColor = 'rgba(114, 137, 218, 0.4)'

  const totalFloorSeriesIsUp =
    totalFloorSeries.data[totalFloorSeries.data.findIndex((num) => num !== null)] <
    totalFloorSeries.data[totalFloorSeries.data.length - 1]

  totalFloorSeries.borderColor = totalFloorSeriesIsUp
    ? 'rgba(68, 183, 0, 1)' // 'var(--online)'
    : 'rgba(183, 68, 0, 1)' // 'var(--offline)'

  totalFloorSeries.backgroundColor = totalFloorSeriesIsUp
    ? 'rgba(68, 183, 0, 0.4)' // 'var(--online)'
    : 'rgba(183, 68, 0, 0.4)' // 'var(--offline)'

  const totalHighestTraitSeriesIsUp =
    totalHighestTraitSeries.data[totalHighestTraitSeries.data.findIndex((num) => num !== null)] <
    totalHighestTraitSeries.data[totalHighestTraitSeries.data.length - 1]

  totalHighestTraitSeries.borderColor = totalHighestTraitSeriesIsUp
    ? 'rgba(68, 183, 0, 1)' // 'var(--online)'
    : 'rgba(183, 68, 0, 1)' // 'var(--offline)'

  totalHighestTraitSeries.backgroundColor = totalHighestTraitSeriesIsUp
    ? 'rgba(68, 183, 0, 0.4)' // 'var(--online)'
    : 'rgba(183, 68, 0, 0.4)' // 'var(--offline)'

  return [totalBoughtSeries, totalFloorSeries, totalHighestTraitSeries]
}

module.exports = getPortfolioSeries
