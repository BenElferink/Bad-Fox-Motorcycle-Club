require('dotenv').config()
const axios = require('axios')
const { ADMIN_CODE } = require('../constants/api-keys')

const URL = 'http://localhost:3000' // 'https://badfoxmc.com'

const run = async () => {
  const keys = []
  const duplicates = []

  try {
    const { data } = await axios.get(`${URL}/api/registered-members?adminCode=${ADMIN_CODE}`)

    for (const registeredMember of data.members) {
      if (!registeredMember.wallet?.address) {
        console.error(registeredMember.username, '- did not submit address')
      } else {
        const sKey = registeredMember.wallet.stakeKey
        const found = keys.find((obj) => obj.wallet.stakeKey === sKey)

        if (found) {
          if (!duplicates.find((obj) => obj.wallet.stakeKey === found.wallet.stakeKey)) {
            duplicates.push(found)
          }
          duplicates.push(registeredMember)
        } else {
          keys.push(registeredMember)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }

  console.log('duplicates:', duplicates.length, duplicates)
}

run()
