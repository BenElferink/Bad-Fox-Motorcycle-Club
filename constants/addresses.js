const BAD_FOX_WALLET =
  'addr1qy4nxzwlrszx2f9mnyl6wsn40qkjvtvq5jv98c75sfc28f6v0ekuq5fz4p0ffw5fk0vdm7762xt2cjmafe0upfhnuf5s3ymguq'
const FOX_ROYALTY_WALLET =
  'addr1q8w9urs982cqumsf8jduljp4x9n7fhdxsv040tfd2grh7xqt56vrsv6ydka57mltwrknh4deemxwax2xjytx5kvc8wtqdkmamz'
const MOTORCYCLE_ROYALTY_WALLET =
  'addr1q8jjrgm79a7957geyv5m9vyr7uxhg55g3q0mk9f8c79jxsyag8ncc5s08e9x02v6quczrczr4lsq8agncr8ktv0szquqptguxa'

const JPG_STORE_WALLET =
  'addr1zxj47sy4qxlktqzmkrw8dahe46gtv8seakrshsqz26qnvzypw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspksr3q9nx'
const CNFT_IO_WALLET = 'addr1w89s3lfv7gkugker5llecq6x3k2vjvfnvp4692laeqe6w6s93vj3j'
const EPOCH_ART_WALLET = 'addr1wyd3phmr5lhv3zssawqjdpnqrm5r5kgppmmf7864p3dvdrqwuutk4'

module.exports = {
  BAD_FOX_WALLET,
  JPG_STORE_WALLET,
  CNFT_IO_WALLET,
  EPOCH_ART_WALLET,
  FOX_ROYALTY_WALLET,
  MOTORCYCLE_ROYALTY_WALLET,
  EXCLUDE_ADDRESSES: [
    BAD_FOX_WALLET,
    FOX_ROYALTY_WALLET,
    MOTORCYCLE_ROYALTY_WALLET,
    JPG_STORE_WALLET,
    CNFT_IO_WALLET,
    EPOCH_ART_WALLET,
  ],
}
