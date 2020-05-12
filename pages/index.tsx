import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { Button } from '@material-ui/core'
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import { GithubUser, authURL, getTokenByRaw } from '../lib/github'
import { hasUser } from '../lib/orm/user'


export default function Home({
  githubAuth,
  has_user,
  has_join,
  user
}: {
  githubAuth: {
    authURL: string,
  },
  has_user: boolean,
  has_join: boolean,
  user?: GithubUser
}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>In solitude, at least we are not alone.</p>
        {!has_user ?
          <p>
            Login in to join TiDB Community.
          </p>
          :
          !has_join?
            <p>
              Hi {user.login}, welcome to TiDB community.
            </p>
            :
            <p>
              Hi {user.login}, you are in TiDB community.
            </p>
        }
      </section>
      <Grid container justify="center" spacing={2}>
        {!has_user &&
          <Grid item>
            <a href={githubAuth.authURL}>
              <Button
                variant="contained"
                color="secondary"
              >
                Auth by GitHub
              </Button>
            </a>
          </Grid>
        }
        {has_user &&
          <Grid item>
            <Link href="/forms/join">
              {/* <Button color="primary">Join TiDB Community</Button> */}
              <Button variant="contained" color="secondary">
                Join TiDB Community
              </Button>
            </Link>
          </Grid>
        }
      </Grid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const githubAuth = { authURL }
  const {
    has_user,
    user
  } = await getTokenByRaw(req.headers.cookie || '')
  let has_join = false
  if (has_user || user) {
    has_join = await hasUser(user.login)
  }
  return {
    props: {
      githubAuth,
      has_user,
      has_join,
      user: user || null
    }
  }
}
