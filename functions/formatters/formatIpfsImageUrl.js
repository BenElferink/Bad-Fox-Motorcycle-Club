const formatIpfsImageUrl = (ipfsUri) => {
  // return `https://alwaysinvert.mypinata.cloud/ipfs/${ipfsUri.replace('ipfs://', '')}`
  return `https://ipfs.blockfrost.dev/ipfs/${ipfsUri.replace('ipfs://', '')}`
}

module.exports = formatIpfsImageUrl
