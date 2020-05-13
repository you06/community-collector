import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import clsx from 'clsx'
import Link from 'next/link'
import urljoin from 'url-join'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { GithubUser, authURL, getTokenByRaw } from '../lib/github'
import { hasUser } from '../lib/orm/user'
import { BASE_URL } from '../lib/const'

interface Props extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  className?: string;
  githubAuth: {
    authURL: string,
  };
  has_user: boolean;
  has_join: boolean;
  user?: GithubUser;
}

const styles = {
  root: {
    'padding-bottom': '24px'
  }
}

export default withStyles(styles)(Home)

function Home(props: Props) {
  const { githubAuth, has_user, has_join, user, classes, className } = props
  
  console.log(classes, className)

  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>In solitude, where we are least alone.</p>
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
            <Button
              variant="contained"
              color="secondary"
              href={githubAuth.authURL}
            >
              Auth by GitHub
            </Button>
          </Grid>
        }
        {has_user && !has_join &&
          <Grid item>
            {/* <Button color="primary">Join TiDB Community</Button> */}
            <Button variant="contained" color="secondary" onClick={handleClickOpen}>
              Join TiDB Community
            </Button>
          </Grid>
        }
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={clsx(classes.root, className)}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" href={urljoin(BASE_URL, '/forms/cn/join')}>
                中国大陆
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" href={urljoin(BASE_URL, '/forms/en/join')}>
                The rest of the world
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const githubAuth = { authURL }
  const {
    has_user,
    user
  } = await getTokenByRaw(req.headers.cookie)
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
