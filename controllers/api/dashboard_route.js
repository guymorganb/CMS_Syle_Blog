const router = require('express').Router();
const User = require('../../models/users');


// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
    // Check if the session exists and is active
    console.log("req.session: ",req.session)
    console.log("req.session.user_id: ", req.session.user_id)
    console.log("req.session.active: ",req.session.active)
    if (req.session && req.session.user_id && req.session.active) {
        next(); // User is authenticated, continue to the requested route
    } else {
        // Redirect the user to the signup page
        res.redirect('/signup');
    }
}


// /dashboard
router.get('/',checkAuth ,(req, res) => {
    imageUrl = "/img/tech4.png";
 // check if the user session token is already valid
    // if not valid then give them the login screen
    try{
        res.status(200).render('dashboard', { isDashboardTemplate: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});

// /dashboard/newpost

// router.get('/viewmyposts', (req, res) => {
//     let imageUrl;
//  // check if the user session token is already valid
//     // if not valid then give them the login screen
//     fetch('https://source.unsplash.com/random')
//         .then(response => {
//             imageUrl = response.url;
//         })
//         .catch(error => {
//             console.log(error);
//             imageUrl = "/img/tech2.png";
//         })
//         .finally(() => {
//             try{
//                 res.status(200).render('dashboard', { isDashboardTemplate: true, imageUrl });
//             }catch(error){
//                 console.error(error);
//                 res.status(500).send('Server Error')
//             }
//         });
// });

// router.get('/newpost', (req, res) => {
//     let imageUrl;
//  // check if the user session token is already valid
//     // if not valid then give them the login screen
//     fetch('https://source.unsplash.com/random')
//         .then(response => {
//             imageUrl = response.url;
//         })
//         .catch(error => {
//             console.log(error);
//             imageUrl = "/img/tech2.png";
//         })
//         .finally(() => {
//             try{
//                 res.status(200).render('dashboard', { isDashboardTemplate: true, imageUrl });
//             }catch(error){
//                 console.error(error);
//                 res.status(500).send('Server Error')
//             }
//         });
// });

module.exports = router;