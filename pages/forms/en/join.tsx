import React from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import urljoin from 'url-join'
import Layout from '../../../components/layout'
import { GithubUser, getTokenByRaw } from '../../../lib/github'
import { useRouter } from 'next/router'
import {
  BASE_URL,
  WorkingStatus,
  JobResearch
} from '../../../lib/const'
import Head from 'next/head'
import {
  Button,
  Checkbox,
  FormGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

export default function Join({
  base_url,
  user
}: {
  base_url: string,
  user?: GithubUser
}) {
  const router = useRouter()
  const [workingStatus, setWorkingStatus] = React.useState(WorkingStatus.Unknown)
  const setWorkingStatusChange = (event) => {
    setWorkingStatus(event.target.value)
  }

  const [jobResearch, setjobResearch] = React.useState({
    [JobResearch.CTO]: false,
    [JobResearch.DBA]: false,
    [JobResearch.InfrastructureDevelopmentEngineer]: false,
    [JobResearch.StorageEngineer]: false,
    [JobResearch.DistributedSystemDirection]: false,
    [JobResearch.Others]: false,
  })

  const handleJobResearchChange = (event) => {
    setjobResearch({ ...jobResearch, [event.target.name]: event.target.checked })
  }

  const [name, changeName] = React.useState('')
  const handleChangeName = (event) => changeName(event.target.value)

  const [wechat, changeWechat] = React.useState('')
  const handleChangeWechat = (event) => changeWechat(event.target.value)

  const [tel, changeTel] = React.useState('')
  const handleChangeTel = (event) => changeTel(event.target.value)

  const [email, changeEmail] = React.useState('')
  const handleChangeEmail = (event) => changeEmail(event.target.value)

  const [otherStatus, changeOtherStatus] = React.useState('')
  const handleChangeOtherStatus = (event) => changeOtherStatus(event.target.value)

  const [workingInstitution, changeWorkingInstitution] = React.useState('')
  const handleChangeWorkingInstitution = (event) => changeWorkingInstitution(event.target.value)

  const [address, changeAddress] = React.useState('')
  const handleChangeAddress = (event) => changeAddress(event.target.value)

  function submit() {
    const data = {
      name,
      wechat,
      tel,
      email,
      otherStatus,
      workingInstitution,
      address,
      jobResearch,
      workingStatus
    }
    console.log(data)
    axios.post(urljoin(base_url, '/api/submit'), data)
      .then(res => {
        if (res.status === 200 && res.data.status === 200) {
          console.log('success')
          router.push('/')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Layout>
      <Head>
        <title>Join TiDB Community</title>
      </Head>
      <section>
        <FormGroup>
          {/* name */}
          <FormControl>
            <InputLabel htmlFor="my-input">GitHub ID</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" disabled={true} value={user !== null ? user.login : ''} />
          </FormControl>
          {/* name */}
          <FormControl>
            <InputLabel htmlFor="my-input">Name</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" value={name} onChange={handleChangeName} />
            <FormHelperText id="my-helper-text">Your realname or nickname.</FormHelperText>
          </FormControl>
          {/* WeChat ID */}
          <FormControl>
            <InputLabel htmlFor="my-input">WeChat ID</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" value={wechat} onChange={handleChangeWechat} />
            <FormHelperText id="my-helper-text">Optional.</FormHelperText>
          </FormControl>
          {/* Phone Number */}
          <FormControl>
            <InputLabel htmlFor="my-input">Phone Number</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" value={tel} onChange={handleChangeTel} />
            {/* <FormHelperText id="my-helper-text">Optional, WeChat ID.</FormHelperText> */}
          </FormControl>
          {/* Email Address */}
          <FormControl>
            <InputLabel htmlFor="my-input">Email Address</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" value={email} onChange={handleChangeEmail} />
            <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
          </FormControl>

          {/* working status */}
          <FormControl>
            <InputLabel htmlFor="my-input">Working Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={workingStatus}
              onChange={setWorkingStatusChange}
              displayEmpty
            >
              <MenuItem value={WorkingStatus.Student}>Student</MenuItem>
              <MenuItem value={WorkingStatus.Working}>Working</MenuItem>
              <MenuItem value={WorkingStatus.Others}>Others</MenuItem>
            </Select>
          </FormControl>
          {workingStatus === WorkingStatus.Others &&
            <FormControl>
              <InputLabel htmlFor="my-input">Working Status</InputLabel>
              <Input id="my-input" aria-describedby="my-helper-text" value={otherStatus} onChange={handleChangeOtherStatus} />
            </FormControl>
          }

          {/* Company or School */}
          {[WorkingStatus.Student, WorkingStatus.Working].includes(workingStatus) &&
            <FormControl>
              <InputLabel htmlFor="my-input">Your {workingStatus2institution(workingStatus)} Name</InputLabel>
              <Input id="my-input" aria-describedby="my-helper-text" value={workingInstitution} onChange={handleChangeWorkingInstitution} />
            </FormControl>
          }

          {/* Job or Research Direction */}
          <FormGroup row>
            {
              Object.keys(JobResearch).map((key) => {
                const value = JobResearch[key]
                return <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      checked={jobResearch[value]}
                      onChange={handleJobResearchChange}
                      name={value}
                    />
                  }
                  label={value}
                />
              })
            }
          </FormGroup>

          {/* Shipping Address */}
          <FormControl>
            <TextField
              id="outlined-multiline-static"
              label="Shipping Address"
              multiline
              rows={4}
              variant="outlined"
              value={address}
              onChange={handleChangeAddress}
            />
            <FormHelperText id="my-helper-text">Please fill in the accurate address for us to send gifts.</FormHelperText>
          </FormControl>
          <Button variant="contained" color="primary" onClick={submit}>
            Submit
          </Button>
        </FormGroup>
      </section>
    </Layout>
  )
}

function workingStatus2institution(status: WorkingStatus): string {
  switch (status) {
    case WorkingStatus.Student: {
      return 'College'
    }
    case WorkingStatus.Working: {
      return 'Company'
    }
  }
  return ''
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const {
    has_user,
    user
  } = await getTokenByRaw(req.headers.cookie)

  if (!has_user) {
    res.writeHead(307, {
      Location: process.env.BASE_URL || '/'
    })
    res.end()
    return
  }

  return {
    props: {
      base_url: BASE_URL,
      user: user || null,
    }
  }
}
