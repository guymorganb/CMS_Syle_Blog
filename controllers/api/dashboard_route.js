const router = require('express').Router();
const User = require('../../models/users');

// /dashboard
router.get('/', (req, res) => {
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