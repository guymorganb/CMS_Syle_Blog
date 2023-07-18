/**
 * posts a comment onto the blog thread
 */
let commentBtn = document.querySelectorAll('.btn-comment');


const init = () => {
    document.addEventListener('DOMContentLoaded', ()=>{
        commentBtn.addEventListener('click', (event)=>{
            
            
            const buttonId = event.target.dataset.id;
            if (event.target.classList.contains('btn-comment')) {

                const postContainer = document.getElementById('userComments');
                

                // Create a string with your HTML
                let cloneString = `
                    <div style="min-height: 50px; width: auto;" id="userComments" data-aos="fade-left" data-aos-delay="0" data-aos-duration="1500" data-aos-once="true" class="col-md-12 text-center post-container" style="background: gray; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="min-height: 50px; width: auto;" class="post-comment-container">
                            <div id="comments" style="width: auto; min-height: 50px; overflow: visible;" class="comment-content" contentEditable="true"></div>
                            <span class="comment-author"></span>
                        </div>
                        <button id="submitBtnElem" class="btn btn-submit">Submit</button>
                    </div>`;
                // Convert the string to a DOM node
                const tempNode = document.createElement('div');
                tempNode.innerHTML = cloneString.trim();
                const clone = tempNode.firstChild;
                // Set the initial width and transition properties on the cloned postContainer
                clone.style.width = "30%";
                clone.style.height = "30%"; // start at 50% width
                clone.style.transition = "all 1s ease-in-out";
                // Append the cloned postContainer after the original postContainer
                postContainer.parentNode.insertBefore(clone, postContainer.nextSibling);
                // After a short delay, change the width to 100% to see the transition
                setTimeout(() => {
                clone.style.width = "100%";
                clone.style.height = "100%";
                }, 100);  // change width after 100ms
                // Create CKEditor instance for the new comment content area
                let editor;
                if (CKEDITOR.instances.postContent) {
                    editor = CKEDITOR.instances.postContent;
                } else {
                    editor = CKEDITOR.replace(`comments`);
                }
                let submitBtn = document.getElementById('submitBtnElem')
                let postContent = editor.getData();
                editor.on( 'change', function( evt ) {
                    postContent = evt.editor.getData();
                });
                submitBtn.addEventListener('click', ()=>{
                    console.log('click')
                })
    
           
    
                // Remove the cloned element after 5.5 seconds
                setTimeout(() => {
                    postContainer.parentNode.removeChild(clone);
                }, 5500);
            }
        });
    });
}

init();
