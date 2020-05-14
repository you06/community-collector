import React from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import urljoin from 'url-join'
import { useRouter } from 'next/router'
import {
  BASE_URL,
  WorkingStatus,
  JobResearch,
  JobResearchOptions
} from '../../../lib/const'
import Head from 'next/head'
import {
  Button,
  Checkbox,
  FormGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { makeStyles } from '@material-ui/core/styles'
import Layout from '../../../components/layout'
import { GithubUser, getTokenByRaw } from '../../../lib/github'

const useStyles = makeStyles({
  root: {
    'margin-top': '24px',
    'margin-bottom': '24px'
  }
})

export default function Join({
  base_url,
  user
}: {
  base_url: boolean,
  user?: GithubUser
}) {
  // console.log(base_url, user)
  const classes = useStyles()

  const router = useRouter()
  const [workingStatus, setWorkingStatus] = React.useState(WorkingStatus.Unknown)
  const [workingStatusErr, setWorkingStatusErr] = React.useState(false)
  const setWorkingStatusChange = (event) => {
    setWorkingStatus(event.target.value)
    setWorkingStatusErr(event.target.value === WorkingStatus.Unknown)
  }

  const [jobResearch, setjobResearch] = React.useState({
    [JobResearch.CTO]: false,
    [JobResearch.DBA]: false,
    [JobResearch.InfrastructureDevelopmentEngineer]: false,
    [JobResearch.StorageEngineer]: false,
    [JobResearch.DistributedSystemDirection]: false,
    [JobResearch.BigData]: false,
    [JobResearch.Others]: false
  })
  const [otherJobResearch, setOtherjobResearch] = React.useState('')
  const handleChangeOtherjobResearch = (event) =>  setOtherjobResearch(event.target.value)

  const handleJobResearchChange = (event) => {
    setjobResearch({ ...jobResearch, [event.target.name]: event.target.checked })
  }

  const [name, changeName] = React.useState('')
  const [nameErr, changeNameErr] = React.useState(false)
  const handleChangeName = (event) => {
    changeName(event.target.value)
    changeNameErr(event.target.value === '')
  }

  const [wechat, changeWechat] = React.useState('')
  const [wechatErr, changeWechatErr] = React.useState(false)
  const handleChangeWechat = (event) => {
    changeWechat(event.target.value)
    changeWechatErr(event.target.value === '')
  }

  const [tel, changeTel] = React.useState('')
  const [telErr, changeTelErr] = React.useState(false)
  const handleChangeTel = (event) => {
    changeTel(event.target.value)
    changeTelErr(event.target.value === '')
  }

  const [email, changeEmail] = React.useState('')
  const handleChangeEmail = (event) => changeEmail(event.target.value)

  const [otherStatus, changeOtherStatus] = React.useState('')
  const handleChangeOtherStatus = (event) => changeOtherStatus(event.target.value)

  const [workingInstitution, changeWorkingInstitution] = React.useState('')
  const handleChangeWorkingInstitution = (event) => changeWorkingInstitution(event.target.value)

  const [address, changeAddress] = React.useState('')
  const [addressErr, changeAddressErr] = React.useState(false)
  const handleChangeAddress = (event) => {
    changeAddress(event.target.value)
    changeAddressErr(event.target.value === '')
  }

  function submit() {
    const validates = [
      {valid: workingStatus !== WorkingStatus.Unknown, fn: setWorkingStatusErr},
      {valid: name !== '', fn: changeNameErr},
      {valid: wechat !== '', fn: changeWechatErr},
      {valid: tel !== '', fn: changeTelErr},
      {valid: address !== '', fn: changeAddressErr}
    ]
    const valid = validates.map(validate => {
      if (!validate.valid) {
        validate.fn(true)
      }
      return validate.valid
    }).reduce((a, b) => a && b)
    if (!valid) return

    const jobResearchArr = []
    for (const k in JobResearch) {
      const v = JobResearch[k]
      if (jobResearch[v] === true) {
        if (k !== JobResearch.Others) {
          jobResearchArr.push(v)
        } else {
          if (otherJobResearch !== '') jobResearchArr.push(otherJobResearch)
        }
      }
    }

    const data = {
      name,
      wechat,
      tel,
      email,
      otherStatus,
      workingInstitution,
      address,
      jobResearch: jobResearchArr,
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
          <TextField disabled label="GitHub" value={user ? user.login : ''} />
          {/* name */}
          <TextField required error={nameErr} label="姓名" value={name} onChange={handleChangeName} />
          {/* WeChat ID */}
          <TextField required error={wechatErr} label="微信 ID" value={wechat} onChange={handleChangeWechat} />
          {/* Phone Number */}
          <TextField required error={telErr} label="手机号码" value={tel} onChange={handleChangeTel} />
          {/* Email Address */}
          <TextField label="邮箱" helperText="我们不会泄露你的邮箱" value={email} onChange={handleChangeEmail} />

          {/* working status */}
          <FormControl>
            <InputLabel htmlFor="my-input">工作状态</InputLabel>
            <Select
              required
              error={workingStatusErr}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={workingStatus}
              onChange={setWorkingStatusChange}
              displayEmpty
            >
              <MenuItem value={WorkingStatus.Student}>学生</MenuItem>
              <MenuItem value={WorkingStatus.Working}>工作中</MenuItem>
              <MenuItem value={WorkingStatus.Others}>其他</MenuItem>
            </Select>
          </FormControl>
          {workingStatus === WorkingStatus.Others &&
            <TextField label="工作状态" value={otherStatus} onChange={handleChangeOtherStatus} />
          }

          {/* Company or School */}
          {[WorkingStatus.Student, WorkingStatus.Working].includes(workingStatus) &&
            <TextField label={`${workingStatus2institution(workingStatus)}名称`} value={workingInstitution} onChange={handleChangeWorkingInstitution} />
          }

          <FormControl className={classes.root}>
            <FormLabel>研究方向</FormLabel>
            {/* Job or Research Direction */}
            <FormGroup row>
              {
                Object.keys(JobResearch).filter(key => {
                  return JobResearchOptions[workingStatus].includes(key)
                }).map(key => {
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
                    label={jobResearch2cn(value)}
                  />
                })
              }
            </FormGroup>
            {/* Other Job or Research Direction */}
            {jobResearch[JobResearch.Others] &&
              <TextField label="其他研究方向" value={otherJobResearch} onChange={handleChangeOtherjobResearch} />
            }
          </FormControl>

          {/* Shipping Address */}
          <FormControl>
            <TextField
              required
              error={addressErr}
              id="outlined-multiline-static"
              label="收货地址"
              multiline
              rows={4}
              variant="outlined"
              value={address}
              onChange={handleChangeAddress}
            />
            <FormHelperText id="my-helper-text">请填写准确的地址方便我们寄送周边</FormHelperText>
          </FormControl>
          <Button variant="contained" color="primary" onClick={submit}>
            提交
          </Button>
        </FormGroup>
      </section>
    </Layout>
  )
}

function workingStatus2institution(status: WorkingStatus): string {
  switch (status) {
    case WorkingStatus.Student: {
      return '学校'
    }
    case WorkingStatus.Working: {
      return '公司'
    }
  }
  return ''
}

function jobResearch2cn(j: JobResearch): string {
  return {
    [JobResearch.CTO]: 'CTO',
    [JobResearch.DBA]: 'DBA',
    [JobResearch.InfrastructureDevelopmentEngineer]: '基础架构开发工程师',
    [JobResearch.StorageEngineer]: '存储工程师',
    [JobResearch.DistributedSystemDirection]: '分布式系统方向',
    [JobResearch.BigData]: '大数据方向',
    [JobResearch.Others]: '其他'
  }[j]
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const props = {
    base_url: BASE_URL,
    user: null
  }

  const {
    has_user,
    user
  } = await getTokenByRaw(req.headers.cookie)

  if (!has_user) {
    res.writeHead(307, {
      Location: BASE_URL
    })
    res.end()
    return {
      props
    }
  }

  props.user = user

  return {
    props
  }
}
