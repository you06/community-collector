import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../../lib/github'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    has_user,
    user
  } = await getToken(req.cookies)
  if (has_user) {
    res.status(200).json({
      has_user,
      github: user.login
    })
  } else {
    res.status(200).json({
      has_user,
      github: ''
    })
  }
}
