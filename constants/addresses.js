const TREASURY_WALLET =
  'addr1q9p9yq4lz834729chxsdwa7utfp5wr754zkn6hltxz42m594guty04nldwlxnhw8xcgd5pndaaqzzu5qzyvnc8tlgdsqtazkyh'

const ROYALTY_WALLET =
  'addr1qyv7wgxd4fjvp9jxr2v6tdpygmjxwatesaemvassemq6jq2rqhw6rvndlmdnp0y7mwvaux4v2wpz5rusyy8c636az70sjxtwe6'

const JPG_STORE_WALLETS = [
  'addr1zxgx3far7qygq0k6epa0zcvcvrevmn0ypsnfsue94nsn3tvpw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspks905plm',
  'addr1zxj47sy4qxlktqzmkrw8dahe46gtv8seakrshsqz26qnvzypw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspksr3q9nx',
  'addr1w999n67e86jn6xal07pzxtrmqynspgx0fwmcmpua4wc6yzsxpljz3',
]

const CNFT_IO_WALLET = 'addr1w89s3lfv7gkugker5llecq6x3k2vjvfnvp4692laeqe6w6s93vj3j'
const EPOCH_ART_WALLET = 'addr1wyd3phmr5lhv3zssawqjdpnqrm5r5kgppmmf7864p3dvdrqwuutk4'

module.exports = {
  TREASURY_WALLET,
  ROYALTY_WALLET,
  JPG_STORE_WALLETS,
  CNFT_IO_WALLET,
  EPOCH_ART_WALLET,
  EXCLUDE_ADDRESSES: [TREASURY_WALLET, ROYALTY_WALLET, ...JPG_STORE_WALLETS, CNFT_IO_WALLET, EPOCH_ART_WALLET],
}
