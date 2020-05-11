import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps, GetServerSideProps } from 'next'
import { Button } from '@material-ui/core'
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import { GithubUser, authURL, getTokenByRaw } from '../lib/github'


export default function Home({
  githubAuth,
  has_user,
  user
}: {
  githubAuth: {
    authURL: string,
  },
  has_user: boolean,
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
          <p>
            Welcome to TiDB Community.
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

        <Grid item>
          <Link href="/forms/join">
            {/* <Button color="primary">Join TiDB Community</Button> */}
            <Button variant="contained" color="secondary">
              Join TiDB Community
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const githubAuth = { authURL }
  const {
    has_user,
    user
  } = await getTokenByRaw(req.headers.cookie)
  return {
    props: {
      githubAuth,
      has_user,
      user: user || null
    }
  }
}
