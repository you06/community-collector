import fetch from 'node-fetch'
import cookie from 'cookie'
import cryptoRandomString from 'crypto-random-string'
import { composeURL } from './url'

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const USERINFO_URL = 'https://api.github.com/user'
const COOKIE_NAME = 'github_login'

const clientID = process.env.GITHUB_APP_CLIENT_ID
const secret = process.env.GITHUB_APP_CLIENT_SECRET

const authParameters = {
  client_id: clientID,
}

const authURL = composeURL(AUTHORIZE_URL, authParameters)

export type RawToken = {
  access_token: string,
  scope?: string,
  token_type?: string
}

export type GithubUser = {
  login: string,
  id: number,
  avatar_url: string,
  type: string,
  name?: string,
  company?: string,
  blog?: string,
  location?: string,
  email?: string,
  bio?: string,
}

type Token = {
  created_at: Date,
  token: string
}

type GithubUsers = {
  [name: string]: {
    user: GithubUser,
    token: Token
  }
}

type Sessions = {
  [name: string]: string
}

const users: GithubUsers = {}
const sessions: Sessions = {}

async function writeToken(token: RawToken) :Promise<{success: boolean, user?: GithubUser, cookie: any}> {
  let user
  const r = {
    success: false,
    user: null,
    cookie: null
  }
  await fetch(USERINFO_URL, {
      method: 'get',
      headers: { 'Authorization': `token ${token.access_token}` },
    })
    .then(raw => raw.json())
    .then(res => {
      // user = parseRes(res)
      user = res as GithubUser
    })

  if (user === null) {
    return r
  }

  users[user.login] = {
    user: user,
    token: {
      created_at: new Date(),
      token: token.access_token
    }
  }

  const cookieStr = cryptoRandomString({length: 20})
  const cookieSerialized = cookie.serialize(COOKIE_NAME, cookieStr, {
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production',
    secure: false,
    maxAge: 72576000,
    httpOnly: true,
    path: '/',
  })
  sessions[cookieStr] = user.login
  r.success = true
  r.user = user
  r.cookie = cookieSerialized
  return r
}

async function getToken(cookie: {[key: string]: string}) : Promise<{has_user: boolean, token?: Token, user?: GithubUser}> {
  // const token = {
  //   created_at: new Date(),
  //   token: 'string'
  // }
  // return {
  //   has_user: true,
  //   token,
  //   user: {
  //     login: 'you06',
  //     id: 123,
  //     avatar_url: 'string',
  //     type: 'string'
  //   }
  // }

  const res = {
    has_user: false,
    token: null,
    user: null
  }

  if (!cookie[COOKIE_NAME]) {
    return res
  }

  const username = sessions[cookie[COOKIE_NAME]]
  if (username === undefined) {
    return res
  }
  const user = users[username]
  if (user === undefined) {
    return res
  }

  // TODO: check token validation
  // by default, the token don't have to expire unless the user revoke it manually
  res.has_user = true
  res.token = user.token
  res.user = user.user
  return res
}

async function getTokenByRaw(rawCookie: string | undefined | null) : Promise<{has_user: boolean, token?: Token, user?: GithubUser}> {
  const cookies = cookie.parse(rawCookie || '') as {[key: string]: string}
  return await getToken(cookies)
}

function parseRes(raw: {[key: string]: string}) : GithubUser | null {
  const mustParseKeys = ['login', 'id', 'avatar_url', 'type']
  const mayParseKeys = ['name', 'company', 'blog', 'location', 'email', 'bio']
  const res = {}
  for (const key of mustParseKeys) {
    if (!raw[key]) {
      return null
    }
    res[key] = raw[key]
  }
  for (const key of mayParseKeys) {
    res[key] = raw[key] || null
  }
  return res as GithubUser
}

export {
  authURL,
  clientID,
  secret,
  writeToken,
  getToken,
  getTokenByRaw
}
