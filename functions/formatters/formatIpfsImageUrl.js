const formatIpfsImageUrl = (ipfsUri) => {
  // return `https://alwaysinvert.mypinata.cloud/ipfs/${ipfsUri.replace('ipfs://', '')}`
  return `https://ipfs.io/ipfs/${ipfsUri.replace('ipfs://', '')}`
}

module.exports = formatIpfsImageUrl
