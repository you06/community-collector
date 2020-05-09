import React from 'react'
import Layout from '../../components/layout'
import Head from 'next/head'
import {
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
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'

enum WorkingStatus {
  Unknown,
  Student,
  Working,
  Others
}

enum JobResearch {
  CTO = 'CTO',
  DBA = 'DBA',
  InfrastructureDevelopmentEngineer = 'Infrastructure Development Engineer',
  StorageEngineer = 'Storage Engineer',
  DistributedSystemDirection = 'Distributed System Direction',
  Others = 'Others'
}

export default function Post() {
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
  };

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
            <Input id="my-input" aria-describedby="my-helper-text" disabled={true} />
          </FormControl>
          {/* name */}
          <FormControl>
            <InputLabel htmlFor="my-input">Name</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
            <FormHelperText id="my-helper-text">Your realname or nickname.</FormHelperText>
          </FormControl>
          {/* WeChat ID */}
          <FormControl>
            <InputLabel htmlFor="my-input">WeChat ID</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
            <FormHelperText id="my-helper-text">Optional.</FormHelperText>
          </FormControl>
          {/* Phone Number */}
          <FormControl>
            <InputLabel htmlFor="my-input">Phone Number</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
            {/* <FormHelperText id="my-helper-text">Optional, WeChat ID.</FormHelperText> */}
          </FormControl>
          {/* Email Address */}
          <FormControl>
            <InputLabel htmlFor="my-input">Email Address</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
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
              <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
          }

          {/* Company or School */}
          {[WorkingStatus.Student, WorkingStatus.Working].includes(workingStatus) &&
            <FormControl>
              <InputLabel htmlFor="my-input">Your {workingStatus2institution(workingStatus)} Name</InputLabel>
              <Input id="my-input" aria-describedby="my-helper-text" />
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
            />
            <FormHelperText id="my-helper-text">Please fill in the accurate address for us to send gifts.</FormHelperText>
          </FormControl>

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
