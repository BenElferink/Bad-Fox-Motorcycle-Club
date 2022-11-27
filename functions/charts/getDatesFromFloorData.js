const getDatesFromFloorData = (floorSnapshots) => {
  const numOfDataPoints = 30

  const dates = floorSnapshots.map(({ timestamp }) => {
    if (timestamp === 'LIVE') return timestamp

    const t = new Date(timestamp)
    const day = t.getDate()
    // const month = t.getMonth()

    // return `${month + 1}/${day}`
    return day
  })

  while (dates.length < numOfDataPoints) dates.unshift(0)
  while (dates.length > numOfDataPoints) dates.shift()

  return dates
}

module.exports = getDatesFromFloorData
