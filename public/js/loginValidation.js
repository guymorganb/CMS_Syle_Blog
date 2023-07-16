/**
 * .js to vlidate user input (client side)
 */
const loginForm = document.getElementById("login_form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const resetButton = document.getElementById("reset");
let msgs = [];
const displayErrorMsgs = function (msgs) {
    const ul = document.createElement("ul"); // creates a ul
    ul.classList.add("messages"); // adds a class to the ul
    // Clear the ul before appending new messages
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for (let msg of msgs) {
        const li = document.createElement("li");
        const text = document.createTextNode(msg);
        li.appendChild(text);
        ul.appendChild(li);
    }
    const node = document.querySelector(".messages"); // selects the ul just made by its class

    if(node == null) {
        loginForm.parentNode.insertBefore(ul, loginForm)
    } else{
        node.parentNode.replaceChild(ul, node);
    }
}
const clearErrors = function(){
    const elements = document.getElementsByClassName('messages')
    Array.from(elements).forEach(function(element){
        element.remove()
    });
    msgs = [];
}
let validate = async function ()  {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!emailPattern.test(email)) {
    msgs[msgs.length] = "Please enter a valid email address.";
    } else if (!passwordPattern.test(password)) {
    msgs[msgs.length] = "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    if (msgs.length == 0) {
      // Fetch API returns a Promise
        try{
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
                // If login is successful, redirect to dashboard
                if (response.ok) {
                    // set the session token in the browser
                    const data = await response.json();
                    document.cookie = `session_token=${data.newSession.session_token}; path=/`
                    msgs[msgs.length] = "Login Success!";
                    displayErrorMsgs(msgs)
                    setTimeout(() => {window.location.href = '/dashboard';}, 500);
                    //heartbeatInterval()
                    return;
                } else {
                    // Display error message from server
                    const data = await response.json();
                    console.error({message: "Server error", Error: data})
                    msgs[msgs.length] = data.message
                    displayErrorMsgs(msgs)
                    return;
                }
        }catch(err){
            console.error({message:"Username or Password is incorrect", Error: err})
        }
    }
    displayErrorMsgs(msgs)
}
const init = () =>{
    document.addEventListener("DOMContentLoaded", function () {
        loginForm.addEventListener("submit", function (event) {
          event.preventDefault();
          validate();
        });
        resetButton.addEventListener("click", function () {
          emailInput.value = "";
          passwordInput.value = "";
          clearErrors()
        });
      });
}
init();
