/**
 * .js for validating new username and password (client side)
 */
const form = document.getElementById('signup_form')
const Username = document.getElementById('Username');
const Password = document.getElementById('Password');
const Verify_Password = document.getElementById('Verify_Password');
const submitbtn = document.getElementById('Sign-in');
const resetBtn = document.getElementById('clear');
let msgs = [];
const displayErrorMsgs = function(msgs) {
    const ul = document.createElement('ul'); //create an element to hold our errors
    ul.classList.add('messages') // add a class to the ul
    // clear the ul before appending new messages
    while(ul.firstChild){
        ul.removeChild(ul.firstChild);
    }
    for(let msg of msgs){
        const li = document.createElement('li');
        const text = document.createTextNode(msg);
        li.appendChild(text);
        ul.appendChild(li)
    }
    const node = document.querySelector('.messages'); // select the node we just made

    if(node == null){
        form.parentNode.insertBefore(ul, form) 
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
let validate = async function() {
    // reminder, these are the elements youll pass to the api call, fName, lName etc.
    const username = Username.value.trim()
    const password = Password.value.trim() 
    const verify = Verify_Password.value.trim();

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
    if (username == "" || username.length < 8){
        msgs[msgs.length] = "Please enter a valid username at leaste 8 charecters long.";
    } else if(!passwordPattern.test(password)){
        msgs[msgs.length] = "Please enter a valid password of 1 uppercase, 1 lowecase, 1 special char, and 1 digit.";
    } else if(password !== verify) {
        msgs[msgs.length] = "Passwords do not match.";
    }
    if (msgs.length == 0) {
    // Fetch API, returns a Promise
        try{
            const response = await fetch('/signup/newuser/credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
                // If login is successful, redirect to dashboard
                if (response.ok) {
                    // set the session token in the browser
                    const data = await response.json();
                    document.cookie = `session_token=${data.newSession.session_token}; path=/`; // set the cookie
                    msgs[msgs.length] = 'Profile Created!';
                    displayErrorMsgs(msgs)
                    // now load a new box which will allow the user to input their username, sends a GET request
                    setTimeout(() => {window.location.href = '/dashboard';}, 500);
                    return;
                } else {
                    // Display error message from server
                    // you have to use await or it wont work
                    const data = await response.json();
                    console.error({message: "Server error", Error: data})
                    msgs[msgs.length] = data.message
                    displayErrorMsgs(msgs)
                    return;
                }
        }catch(err){
            console.error({message:"Server error", Error: err})
        }
    }
    displayErrorMsgs(msgs)
}
const init = () =>{
    document.addEventListener("DOMContentLoaded", function () {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          validate();
        });
        resetBtn.addEventListener("click", function () {
            Username.value = "";
            Password.value = "";
            Verify_Password.value = "";
            clearErrors()
        });
      });
}
init();

// document.cookie:  session_token=b1d11468-7ac6-4bbc-9598-758ae20dcfb1