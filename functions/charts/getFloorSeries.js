const getFloorSeries = (floorSnapshots, isMonth, selectedCategory) => {
  const series = []

  const addToSeries = (trait, price) => {
    let idx = series.findIndex(({ name }) => name === trait)

    if (idx != -1) {
      series[idx].data.push(Math.round(price))
    } else {
      series.push({
        name: trait,
        data: [Math.round(price)],
      })

      idx = series.length - 1
    }

    if (isMonth) {
      while (series[idx].data.length < 30) series[idx].data.unshift(null)
      while (series[idx].data.length > 30) series[idx].data.shift()
    } else {
      while (series[idx].data.length < 7) series[idx].data.unshift(null)
      while (series[idx].data.length > 7) series[idx].data.shift()
    }
  }

  floorSnapshots.forEach(({ attributes }) => {
    if (selectedCategory) {
      Object.entries(attributes[selectedCategory]).forEach(([trait, price]) => {
        addToSeries(trait, price)
      })
    } else {
      Object.entries(attributes).forEach(([cat, traits]) => {
        Object.entries(traits).forEach(([trait, price]) => {
          addToSeries(`${cat}: ${trait}`, price)
        })
      })
    }
  })

  return series
}

module.exports = getFloorSeries
