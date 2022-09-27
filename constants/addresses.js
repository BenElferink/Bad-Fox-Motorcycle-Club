const BAD_FOX_WALLET =
  'addr1q9p9yq4lz834729chxsdwa7utfp5wr754zkn6hltxz42m594guty04nldwlxnhw8xcgd5pndaaqzzu5qzyvnc8tlgdsqtazkyh'
const BAD_FOX_ROYALTY_WALLET =
  'addr1qyv7wgxd4fjvp9jxr2v6tdpygmjxwatesaemvassemq6jq2rqhw6rvndlmdnp0y7mwvaux4v2wpz5rusyy8c636az70sjxtwe6'
const BAD_MOTORCYCLE_ROYALTY_WALLET =
  'addr1qy3lxlrp726amewszc3rcs44h8rmm33vwj5ras8ya0g5t2rldmc2xmvksm8ec5z6w9rwzy5pnguk5dldfg43jalywges0jmdm5'

const JPG_STORE_WALLET =
  'addr1zxj47sy4qxlktqzmkrw8dahe46gtv8seakrshsqz26qnvzypw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspksr3q9nx'
const CNFT_IO_WALLET = 'addr1w89s3lfv7gkugker5llecq6x3k2vjvfnvp4692laeqe6w6s93vj3j'
const EPOCH_ART_WALLET = 'addr1wyd3phmr5lhv3zssawqjdpnqrm5r5kgppmmf7864p3dvdrqwuutk4'

module.exports = {
  BAD_FOX_WALLET,
  JPG_STORE_WALLET,
  CNFT_IO_WALLET,
  EPOCH_ART_WALLET,
  BAD_FOX_ROYALTY_WALLET,
  BAD_MOTORCYCLE_ROYALTY_WALLET,
  EXCLUDE_ADDRESSES: [
    BAD_FOX_WALLET,
    BAD_FOX_ROYALTY_WALLET,
    BAD_MOTORCYCLE_ROYALTY_WALLET,
    JPG_STORE_WALLET,
    CNFT_IO_WALLET,
    EPOCH_ART_WALLET,
  ],
}
