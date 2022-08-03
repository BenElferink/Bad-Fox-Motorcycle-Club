const assetsFile = require('../../data/assets/fox')

const formatJpgItem = (item) => {
  const { asset_id, display_name, price_lovelace, listing_lovelace, confirmed_at, listed_at } = item

  const {
    onchain_metadata: { rank, image, attributes },
  } = assetsFile.assets.find(({ asset }) => asset === asset_id)

  return {
    assetId: asset_id,
    name: display_name,
    rank,
    attributes,
    itemUrl: `https://jpg.store/asset/${asset_id}`,
    imageUrl: image.cnftTools,
    price: Number(price_lovelace ?? listing_lovelace) / 1000000,
    date: new Date(confirmed_at ?? listed_at),
  }
}

module.exports = formatJpgItem
