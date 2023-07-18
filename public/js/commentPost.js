/**
 * posts a comment onto the blog thread
 */
let commentBtn = document.getElementById('btn-comment')


const init = () =>{
    document.addEventListener('DOMContentLoaded', ()=>{
        commentBtn.addEventListener('click', (event)=>{
            if (event.target.classList.contains('btn-comment')) {
                // Get the post container of the clicked button
                const postContainer = event.target.closest('.post-container');
    
                // Check if the comment box already exists
                const commentBox = postContainer.querySelector('.comment-box');
                const commentBoxes = document.querySelectorAll('.comment-box');
                
                // If there are any comment boxes, remove them
                commentBoxes.forEach(box => box.remove());
                // If the comment box exists, remove it
                // if (commentBox) {
                //     commentBox.remove();
                // } else {
                //     // If the comment box doesn't exist, create it
                //     const textarea = document.createElement('textarea');
                //     textarea.classList.add('comment-box');
                    
                //     // Append the textarea to the post container
                //     postContainer.appendChild(textarea);
                // }
            }

        })
    })
}
