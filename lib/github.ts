import fetch from 'node-fetch'
import { composeURL } from './url'

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const USERINFO_URL = 'https://api.github.com/user'

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

const users: GithubUsers = {}

async function writeToken(token: RawToken) {
  await fetch(USERINFO_URL, {
      method: 'get',
      headers: { 'Authorization': `token ${token.access_token}` },
    })
    .then(raw => raw.json())
    .then(res => {
      let user = res as GithubUser
      users[user.login] = {
        user: user,
        token: {
          created_at: new Date(),
          token: token.access_token
        }
      }
    })
}

function getToken(user: string) :{has_user: boolean, token?: Token, user?: GithubUser} {
  if (users[user]) {
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

export {
  authURL,
  clientID,
  secret,
  writeToken,
  getToken
}
