import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { clientID, secret, RawToken, writeToken } from '../../../lib/github'
import { parseParameters } from '../../../lib/url'
import { TIME_OUT } from '../../../lib/const'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const code: string = req.query.code as string
  const body = {
    client_id: clientID,
    client_secret: secret,
    code
  }
  const timeout = setTimeout(() => {
      res.status(500).json({ text: 'Timeout' })
    },
    TIME_OUT,
  )

  await fetch('https://github.com/login/oauth/access_token', {
      method: 'post',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(raw => raw.text())
    .then(async raw => {
      const parsed = parseParameters(raw) as RawToken
      const {success, cookie: cookieSerialized} = await writeToken(parsed)
      // TODO: handle failed login
      if (success) {
        res.setHeader('Set-Cookie', cookieSerialized)
      }
      res.writeHead(307, {
        Location: process.env.BASE_URL || '/'
      })
      res.end()
    })
    .finally(() => {
      clearTimeout(timeout)
    })
}
