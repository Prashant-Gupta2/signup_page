const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('mydb','root','561413',{
    host:'localhost',
    dialect:'mysql'      
})
sequelize.authenticate()
.then(()=>{
 console.log("Database connecrted")
}).catch((err)=>{
 console.log(err)
})

module.exports = sequelize;