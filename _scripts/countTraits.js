const fs = require('fs')
const traitsFile = require('../data/traits/fox')
const assetsFile = require('../data/assets/fox')

const run = async () => {
  const traits = {}
  const assets = assetsFile.assets
  const numOfAssets = assets.length

  Object.entries(traitsFile).forEach(([category, attributes]) => {
    attributes.forEach((attributeObj) => {
      const label = attributeObj.label
      const gender = attributeObj.gender
      const prefix = gender === 'Male' ? '(M) ' : gender === 'Female' ? '(F) ' : '(U) '

      const labelCount = assets.filter(
        (item) => label === item.onchain_metadata.attributes[category.replace(' + Tail', '')].replace(prefix, '')
      ).length

      const payload = {
        ...attributeObj,
        count: labelCount,
        percent: `${(labelCount / (numOfAssets / 100)).toFixed(2)}%`,
      }

      if (traits[category]) {
        traits[category].push(payload)
      } else {
        traits[category] = [payload]
      }
    })
  })

  Object.entries(traits).forEach(([key, val]) => {
    traits[key] = val.sort((a, b) => a.count - b.count)
  })

  fs.writeFileSync('./data/traits/fox.json', JSON.stringify(traits), 'utf8')
  console.log('Done!')
}

run()
