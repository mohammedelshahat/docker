const dotenv = require('dotenv');

const envFound = dotenv.config();
if (!envFound) {
  throw new Error(' Couldn\'t find .env file!');
}

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  operatorsAliases: false,
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
};
