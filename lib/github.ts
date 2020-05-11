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

async function writeToken(token: RawToken) :Promise<{user: string, cookie: any}> {
  let user
  await fetch(USERINFO_URL, {
      method: 'get',
      headers: { 'Authorization': `token ${token.access_token}` },
    })
    .then(raw => raw.json())
    .then(res => {
      user = res as GithubUser
      users[user.login] = {
        user: user,
        token: {
          created_at: new Date(),
          token: token.access_token
        }
      }
    })
  const cookieStr = cryptoRandomString({length: 10})
  const cookieSerialized = cookie.serialize(COOKIE_NAME, cookieStr, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 72576000,
    httpOnly: true,
    path: '/',
  })
  sessions[cookieStr] = user.login
  return {
    user: user.login,
    cookie: cookieSerialized
  }
}

async function getToken(cookie: {[key: string]: string}) : Promise<{has_user: boolean, token?: Token, user?: GithubUser}> {
  if (!cookie[COOKIE_NAME]) {
    return {
      has_user: false
    }
  }

  const user = sessions[cookie[COOKIE_NAME]]

  if (users[user]) {
    // TODO: check token validation
    // by default, the token don't have to expire unless the user revoke it manually

    return {
      has_user: true,
      token: users[user].token,
      user: users[user].user
    }
  }

  return {
    has_user: false
  }
}

async function getTokenByRaw(rawCookie: string) : Promise<{has_user: boolean, token?: Token, user?: GithubUser}> {
  const cookies = cookie.parse(rawCookie)
  return await getToken(cookies)
}

export {
  authURL,
  clientID,
  secret,
  writeToken,
  getToken,
  getTokenByRaw
}
