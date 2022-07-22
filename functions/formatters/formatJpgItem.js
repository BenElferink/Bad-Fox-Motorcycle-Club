const assetsFile = require('../../data/assets/fox')

const formatJpgItem = (item) => {
  const { asset_id } = item
  const asset = assetsFile.assets.find(({ asset }) => asset === asset_id)

  const {
    onchain_metadata: { name, rank, image, attributes },
  } = asset

  return {
    assetId: asset_id,
    name,
    rank,
    price: Number(item.price_lovelace ?? item.listing_lovelace) / 1000000,
    imageUrl: image.cnftTools,
    itemUrl: `https://jpg.store/asset/${asset_id}`,
    attributes,
    date: new Date(item.confirmed_at ?? item.listed_at),
  }
}

module.exports = formatJpgItem
