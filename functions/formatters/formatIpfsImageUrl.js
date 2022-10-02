const formatIpfsImageUrl = (ipfsUri, hasRank) => {
  // return `${ipfsUri.replace('ipfs://', 'https://')}.ipfs.nftstorage.link`
  // return ipfsUri.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/')

  if (hasRank) {
    return ipfsUri.replace('ipfs://', 'https://images.cnft.tools/ipfs/')
  } else {
    return ipfsUri.replace('ipfs://', 'https://alwaysinvert.mypinata.cloud/ipfs/')
  }
}

module.exports = formatIpfsImageUrl
