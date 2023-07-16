/**
 * Setup server & Routes
 */
const express = require('express');                                     // Import the Express module
require('dotenv').config();
const routes = require('./controllers');                                // Import the routes from the controllers file
const sequelize = require('./config/dbconnection.js');                  // Import the Sequelize instance from the dbconnection.js file
const app = express();                                                  // Create an instance of the Express application
const PORT = process.env.PORT || 3001;                                  // Define the port for the server to listen on
const exphbs = require('express-handlebars');                           // Import the Express Handlebars module
const session = require('express-session');                             // used for session cookies
const path = require('path');                                           // Import the path module
const helpers = require('./utils/helpers');                             // Import the helper functions
const Session = require('./models/sessions');
const hbs = exphbs.create({                                             // Create an instance of Express Handlebars with helpers and default layout
    helpers: helpers,
    defaultLayout: 'main' 
});        
               

app.engine('handlebars', hbs.engine);                            // Set the handlebars engine for rendering views
app.set('view engine', 'handlebars');

app.use(express.json());                                         // Parse JSON bodies sent in requests
// sets up your cookies
app.use(session({
    secret: process.env.SECRET,                                 // the secret helps with hashing the session cookie I think?
    resave: false,                                              // set resave to false to prevent potentially problematic race conditions.
    saveUninitialized: false,
    cookie: { 
        secure: false,                                          // `true` for HTTPS, `false` for HTTP
        httpOnly: true,                                         // Blocks client-side JavaScript from accessing the cookie
        maxAge:  3600000,                                       // The duration in milliseconds for which the cookie is valid
        sameSite: false,
        proxy: false                                            //Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
    }
}));

app.use(express.urlencoded({ extended: true }));                // Parse URL-encoded bodies sent in requests
app.use(express.static(path.join(__dirname, 'public')));        // Serve static files from the 'public' directory
app.use(routes); // Use the defined routes

sequelize.sync({ force: false }).then(() => {                   // Sync the Sequelize models with the database (force: false to preserve data)
    app.listen(PORT, () => console.log('Server Listening!'));   // Start the server and listen on the specified port
    
    setInterval(async () => {                                   // Set up interval to remove expired sessions every hour
        await Session.removeExpiredSessions();
      }, 60 * 60 * 1000);
      
      setInterval(() => {
        const cutoff = new Date(Date.now() - (10 * 1000)); // 5 minutes ago, plus 1 minute grace period
        Session.clearExpiredSessions(cutoff);   // if updated_at is less than rightNow - 5 minutes, delete the session.
      }, 10 * 1000); // Every 5 minutes
});

//  5 * 60 * 1000 + 1 * 60 * 1000

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