import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../lib/github'
import { User, createUser } from '../../lib/orm/user'
import { JobResearch } from '../../lib/const'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(500).json({
      status: 500,
      text: '^_^'
    })
  }

  const {
    has_user,
    user
  } = await getToken(req.cookies)

  if (!has_user) {
    res.status(500).json({
      status: 500,
      text: 'Invalid user'
    })
    res.end()
    return
  }

  console.log(req.body)
  const body = req.body

  const u: User = {
    github: user.login,
    name: body.name || null,
    wechat: body.wechat || null,
    tel: body.tel || null,
    email: body.email || null,
    working_status: body.workingStatus || null,
    institution_name: body.workingInstitution || null,
    location: body.address || null,
    job_research: body.jobResearch || []
  }

  await createUser(u)

  res.status(200).json({
    status: 200,
    text: 'Success'
  })
}
