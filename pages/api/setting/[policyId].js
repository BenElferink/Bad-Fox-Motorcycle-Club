import connectDB from '../../../utils/mongo'
import Setting from '../../../models/Setting'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { policyId },
      body,
    } = req

    if (!isPolicyIdAllowed(policyId)) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: `This policy ID is not allowed: ${policyId}`,
      })
    }

    switch (method) {
      case 'GET': {
        let setting = await Setting.findOne({ policyId })

        if (!setting) {
          setting = new Setting({ policyId })
          await setting.save()
        }

        return res.status(200).json(setting)
      }

      case 'PATCH': {
        console.log('admin_code',admin_code);
        console.log('ADMIN_CODE',ADMIN_CODE);
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        const setting = await Setting.findOneAndUpdate({ policyId }, body, { new: true })

        return res.status(200).json(setting)
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'PATCH')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
