import { STRING, Model } from 'sequelize'
import { sequelize } from './db'

export type User = {
  github: string,
  name?: string,
  wechat?: string,
  tel?: string,
  email?: string,
  working_status?: string,
  institution_name?: string,
  location?: string,
  job_research: string[]
}

class UserOrm extends Model {}
UserOrm.init({
  github: {
    type: STRING,
    allowNull: false
  },
  name: {
    type: STRING,
    allowNull: true,
  },
  wechat: {
    type: STRING,
    allowNull: true
  },
  tel: {
    type: STRING,
    allowNull: true
  },
  email: {
    type: STRING,
    allowNull: true
  },
  working_status: {
    type: STRING,
    allowNull: true
  },
  institution_name: {
    type: STRING,
    allowNull: true
  },
  job_research: {
    type: STRING,
    allowNull: true
  },
  location: {
    type: STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'contributor_info'
})

async function hasUser(github: string) :Promise<boolean> {
  return null !== await UserOrm.findOne({where: {github}})
}

async function createUser(user: User) {
  const job_research = user.job_research ? user.job_research.join(',') : null
  delete user.job_research 
  await UserOrm.create({
    ...user,
    job_research
  })
}

export {
  hasUser,
  createUser
}
