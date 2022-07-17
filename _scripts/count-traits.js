const fs = require('fs')
const traitsFile = require('../data/traits')
const blockfrostFile = require('../data/blockfrost')

const run = async () => {
  const traits = {}
  const assets = blockfrostFile.assets
  const numOfAssets = assets.length

  Object.entries(traitsFile).forEach(([category, attributes]) => {
    attributes.forEach((attributeObj) => {
      const label = attributeObj.label

      const labelCount = assets.filter(
        (assetObj) =>
          assetObj.onchain_metadata.attributes[category.replace(' + Tail', '')].replace(
            attributeObj.gender === 'Male' ? '(M) ' : attributeObj.gender === 'Female' ? '(F) ' : '(U) ',
            ''
          ) === label
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

  fs.writeFileSync('./data/traits.json', JSON.stringify(traits), 'utf8')
  console.log('done!')
}

run()
