require('dotenv').config();
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(
  'mydb',
  'root',
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);
sequelize.authenticate()
.then(()=>{
 console.log("Database connected")
}).catch((err)=>{
 console.log(err)
})

module.exports = sequelize;