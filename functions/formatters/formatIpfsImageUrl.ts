const formatIpfsImageUrl = ({
  ipfsUri,
  hasRank,
  is3D,
}: {
  ipfsUri: string
  hasRank?: boolean
  is3D?: boolean
}) => {
  if (is3D) {
    return ipfsUri.replace('ipfs://', 'https://image-optimizer.jpgstoreapis.com/')
  }

  if (hasRank) {
    return ipfsUri.replace('ipfs://', 'https://images.cnft.tools/ipfs/')
  } else {
    return ipfsUri.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/')
    // return ipfsUri.replace('ipfs://', 'https://ipfs.jpgstoreapis.com/')
    // return ipfsUri.replace('ipfs://', 'https://alwaysinvert.mypinata.cloud/ipfs/')
  }
}

export default formatIpfsImageUrl
