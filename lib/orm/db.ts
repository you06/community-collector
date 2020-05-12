import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || 'test',
  process.env.DATABASE_USER || 'root',
  process.env.DATABASE_PASSWD || '', {
    host: process.env.DATABASE_HOST || '127.0.0.1:3306',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    dialect: 'mysql',
    define: {
      timestamps: true
    }
  }
)

export {
  sequelize
}
