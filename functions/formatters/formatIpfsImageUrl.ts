const formatIpfsImageUrl = (ipfsUri: string, hasRank?: boolean) => {
  if (hasRank) {
    return ipfsUri.replace('ipfs://', 'https://images.cnft.tools/ipfs/')
  } else {
    // return ipfsUri.replace('ipfs://', 'https://ipfs.jpgstoreapis.com/')
    return ipfsUri.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/')
    // return `${ipfsUri.replace('ipfs://', 'https://')}.ipfs.nftstorage.link`
    // return ipfsUri.replace('ipfs://', 'https://alwaysinvert.mypinata.cloud/ipfs/')
  }
}

export default formatIpfsImageUrl
