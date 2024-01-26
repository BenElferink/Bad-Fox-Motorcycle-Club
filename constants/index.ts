export const ADA_SYMBOL = '₳'
export const ONE_MILLION = 1000000
export const APRIL_20_BLOCK = 8668854

export const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || ''

export const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
export const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
export const FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
export const FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
export const FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

export const ADA_HANDLE_POLICY_ID = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a'
export const BAD_FOX_POLICY_ID = 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967'
export const BAD_MOTORCYCLE_POLICY_ID = 'ab662f7402af587e64d217995e20f95ac3ae3ff8417d9158b04fbba8'
export const BAD_KEY_POLICY_ID = '80e3ccc66f4dfeff6bc7d906eb166a984a1fc6d314e33721ad6add14'
export const BAD_FOX_3D_POLICY_ID = '8804474d85430846883b804375b26b17c563df2338ea9b46652c3164'

export const BAD_FOX_WALLET = 'addr1vytm0f6n564th94cld4xgzr0g8xp4s2j07ww33qn4x2ss6gmmdzlm'
export const BAD_FOX_SIGNING_KEY = process.env.BAD_FOX_SIGNING_KEY || ''
export const BAD_MOTORCYCLE_WALLET = 'addr1v8l4qgz688jxgerq788kp3xv7qdjymchddrv3dxyug5e3pg83anxd'
export const BAD_MOTORCYCLE_SIGNING_KEY = process.env.BAD_MOTORCYCLE_SIGNING_KEY || ''
export const BAD_KEY_WALLET = 'addr1v9tce86r8v9larevjr7el7d5ua3eruz2cn4d93mqmt8w4agmy2leh'
export const BAD_KEY_SIGNING_KEY = process.env.BAD_KEY_SIGNING_KEY || ''

export const TRADE_APP_MNEMONIC = Array.isArray(process.env.TRADE_APP_MNEMONIC)
  ? process.env.TRADE_APP_MNEMONIC
  : process.env.TRADE_APP_MNEMONIC?.split(',') || []

export const TREASURY_WALLET = 'addr1q9p9yq4lz834729chxsdwa7utfp5wr754zkn6hltxz42m594guty04nldwlxnhw8xcgd5pndaaqzzu5qzyvnc8tlgdsqtazkyh'
export const ROYALTY_WALLET = 'addr1qyv7wgxd4fjvp9jxr2v6tdpygmjxwatesaemvassemq6jq2rqhw6rvndlmdnp0y7mwvaux4v2wpz5rusyy8c636az70sjxtwe6'
export const TRADE_APP_WALLET = 'addr1v86z46xfdzfyvv9dmm4aafc2qyqcu7m6av9gnpvqk68fd5cvvzfpm'

export const MARKETPLACE_ADDRESSES = [
  'addr1zxgx3far7qygq0k6epa0zcvcvrevmn0ypsnfsue94nsn3tvpw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspks905plm', // jpg.store
  'addr1zxj47sy4qxlktqzmkrw8dahe46gtv8seakrshsqz26qnvzypw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspksr3q9nx', // jpg.store
  'addr1w999n67e86jn6xal07pzxtrmqynspgx0fwmcmpua4wc6yzsxpljz3', // jpg.store
  'addr1w89s3lfv7gkugker5llecq6x3k2vjvfnvp4692laeqe6w6s93vj3j', // cnft.io
  'addr1wyd3phmr5lhv3zssawqjdpnqrm5r5kgppmmf7864p3dvdrqwuutk4', // epoch.art
]
