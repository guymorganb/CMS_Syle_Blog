/**
 * The heartbeat pings the server each time the user visits the dashboard to make a new post or view a post and updates the session
 */
document.addEventListener('DOMContentLoaded', async ()=>{
// Start the heartbeat system after the user logs in
  const heartbeatInterval = setInterval(async () => {
  const session_token = document.cookie
 .split('; ')
 .find(row => row.startsWith('session_token'))
 .split('=')[1];
 if (!session_token) {
  console.error('Session token not found in cookies');
  // handle error here, maybe redirect the user to login page
  window.location.href = '/login'
  return;
}
  await fetch('/heartbeat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sessionToken: session_token }) // Assuming you have the user's ID stored somewhere
  })
  console.log("heartbeat interval ran")
  .catch(error => console.error('Error in clientside heartbeat:', error));
}, 10 * 1000); 
clearInterval(heartbeatInterval);
})


// Every 5 minutes 5 * 60 * 1000
// clear the interval when the user logs out



