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


/**
 * Here's a basic example of generating a JWT in Node.js using the jsonwebtoken package.
 *
 * javascript
 * Copy code
 * const jwt = require('jsonwebtoken');
 *
 * const payload = {
 *   userId: 1234,
 *   name: "John Doe",
 *   role: "admin"
 * };
 *
 * const secret = 's3cr3t'; // This should be stored in an environment variable, not in the code.
 *
 * // sign the payload, i.e. create a new JWT
 * const token = jwt.sign(payload, secret, { expiresIn: '1h' });
 *
 * console.log(token);
 * In the above code:
 *
 * We first define a payload that is a JavaScript object. The payload contains the data that we want to include in the JWT.
 *
 * We then define a secret. This is used to sign the token
 */