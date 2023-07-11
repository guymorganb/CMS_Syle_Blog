/**
 * Server Routes
 */
const express = require('express')
const routes = require('./routes');
const sequelize = require('./config/dbconnection')
const app = express();
const PORT = 3001 || process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(routes);

sequelize.sync({force: false}).then(()=>{
    app.listen(PORT, () => console.log('Server Listening!'))
})