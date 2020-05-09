import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Button } from '@material-ui/core'
import { authURL } from '../lib/github'

export default function Home({
  githubAuth
}: {
  githubAuth: {
    authURL: string
  }
}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>In solitude, at least we are not alone.</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section>
        <a href={githubAuth.authURL}>
          <Button
            variant="contained"
            color="secondary"
          >
            Auth by GitHub
          </Button>
        </a>

        <Link href="/forms/join">
          {/* <Button color="primary">Join TiDB Community</Button> */}
          <Button variant="contained" color="secondary">
            Join TiDB Community
          </Button>
        </Link>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const githubAuth = { authURL }
  return {
    props: {
      githubAuth
    }
  }
}
