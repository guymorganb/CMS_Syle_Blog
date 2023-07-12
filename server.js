/**
 * Setup server & Routes
 */
const express = require('express');                                     // Import the Express module
const routes = require('./controllers');                                // Import the routes from the controllers file
const sequelize = require('./config/dbconnection.js');                  // Import the Sequelize instance from the dbconnection.js file
const app = express();                                                  // Create an instance of the Express application
const PORT = 3001 || process.env.PORT;                                  // Define the port for the server to listen on
const exphbs = require('express-handlebars');                           // Import the Express Handlebars module
const path = require('path');                                           // Import the path module
const helpers = require('./utils/helpers.js');                          // Import the helper functions
const hbs = exphbs.create({ helpers });                           // Create an instance of Express Handlebars with helpers

app.engine('handlebars', hbs.engine);                               // Set the handlebars engine for rendering views
app.set('view engine', 'handlebars');

app.use(express.json());                                                // Parse JSON bodies sent in requests
app.use(express.urlencoded({ extended: true }));                 // Parse URL-encoded bodies sent in requests
app.use(express.static(path.join(__dirname, 'public')));                // Serve static files from the 'public' directory
app.use(routes); // Use the defined routes

sequelize.sync({ force: false }).then(() => {            // Sync the Sequelize models with the database (force: false to preserve data)
    app.listen(PORT, () => console.log('Server Listening!'));   // Start the server and listen on the specified port
});



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