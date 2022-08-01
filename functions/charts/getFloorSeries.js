const getFloorSeries = (floorData, isMonth) => {
  const series = Object.entries(floorData).map(([gender, arr]) => {
    const payload = {
      name: gender,
      data: arr.map(({ price }) => Math.round(price)),
    }

    if (isMonth) {
      while (payload.data.length < 30) payload.data.unshift(null)
      while (payload.data.length > 30) payload.data.shift()
    } else {
      while (payload.data.length < 7) payload.data.unshift(null)
      while (payload.data.length > 7) payload.data.shift()
    }

    return payload
  })

  return series
}

module.exports = getFloorSeries
