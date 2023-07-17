/**
 * pings the server each time the user visits the dashboard to make a new post or view a post and updates the session
 */
const init = () =>{
  document.addEventListener('DOMContentLoaded', async ()=>{
    // Start the ping system after the user logs in
    try{
      // split apart the cookie from the document object so you can use it
      const session_token = document.cookie.split('; ').find(row => row.startsWith('session_token')).split('=')[1];
      if (!session_token) {
        console.error('Session token not found in cookies');
        // handle error here, maybe redirect the user to login page
        window.location.href = '/'
        return;
      }
        const response = await fetch('/ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionToken: session_token }) // Assuming you have the user's ID stored somewhere
        })
        
      if(response.ok){
        console.log("ping status ok")
        return
      }
    }catch(err){
      console.error(err)
    }
    })
}
init();
// Every 5 minutes 5 * 60 * 1000
// clear the interval when the user logs out



