/**
 * posts a comment onto the blog thread
 */
let commentBtns = document.querySelectorAll('.btn-comment');
let htmlElem = document.querySelectorAll('.comments-only')
let submitBtn = document.querySelectorAll('.btn-submit');
const init = () => {
    document.addEventListener('DOMContentLoaded', ()=>{
        commentBtns.forEach(btn => {
            btn.addEventListener('click', (event)=> {
            const buttonId = event.target.dataset.id;
            if (event.target.classList.contains('btn-comment')) {
                // Check if a clone has already been created
                if (event.target.dataset.cloneCreated) {
                    // A clone has been created, do nothing
                    return;
                } else {
                    // No clone has been created yet, create one
                    event.target.dataset.cloneCreated = true; // Set the attribute to prevent multiple clones
                }

                // Create a string clone
                let cloneString = `
                <div class="userComments" data-aos="fade-left" data-aos-delay="0" data-aos-duration="1500" data-aos-once="true" class="col-md-8 text-center" >
                    <div class="post-comment-container">
                        <div data-id=${buttonId} id="comments" class="comment-content" contentEditable="true">Enter a comment</div>
                        <span class="comment-author"></span>
                    </div>
                    <button data-id=${buttonId} id="submitBtnElem" class="btn btn-submit">Submit</button>
                </div>`;
                // Convert the string to a DOM node
                const tempNode = document.createElement('div');
                tempNode.innerHTML = cloneString.trim();
                const clone = tempNode.firstChild;
                // Set the initial width and transition properties on the cloned postContainer
                clone.style.width = "10%";
                clone.style.height = "40%"; // start at 50% width
                clone.style.transition = "all 1s ease-in-out";
                let commentDiv = clone.querySelector('.comment-content');
                commentDiv.addEventListener('click', () => {
                    // Remove the cloned element after 15 seconds
                    if (commentDiv.textContent == 'Enter a comment') {
                        commentDiv.textContent = '';
                    }
                });
                // Find all comments-only divs
                const commentsDivs = document.querySelectorAll('.comments-only');
                // loop through the elements and get the matching data-ids
                commentsDivs.forEach(commentsDiv =>{
                    if(commentsDiv.dataset.id  == buttonId){
                    // Append the clone
                    commentsDiv.appendChild(clone);
                    // After a short delay, change the width to 100% to see the transition
                    setTimeout(() => {
                    clone.style.width = "50%";
                    }, 100);  // change width after 100ms
                    // now attaching click event to the inner comment buttons
                }
                // Find the corresponding submit button inside the clone
                const submitButton = clone.querySelector('.btn-submit');
                submitButton.addEventListener('click', async (event) => {
                    if (event.target.dataset.clicked) {
                        // A clone has been created, do nothing
                        return;
                    } else {
                        // No clone has been created yet, create one
                        event.target.dataset.clicked = true; // Set the attribute to prevent multiple clones
                    }
                    let postId = event.target.dataset.id
                    const commentData = commentDiv.textContent
                    const session_token = document.cookie.split('; ').find(row => row.startsWith('session_token')).split('=')[1];
                        // on submit send an api post request
                        try{
                            const response = await fetch('/editpost', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ postId, commentData, session_token })
                            });
                            if (response.status == 200) {
                                const data = await response.json();
                                setTimeout(() => {window.location.href = '/dashboard';}, 500);
                               console.log("data ", data.message)
                            } else {
                                const text = await response.text(); // parse as text instead of JSON
                                console.error({message: "Server error", Error: text.message})
                                return;
                            }
                        }catch(err){
                            console.error({message:"Server error", Error: err})
                        }
                    });
                })
            }
        });
    });
}
)}
init();

