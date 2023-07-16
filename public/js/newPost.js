/**
 * .js to send the new post from the dashboard to the server for storage
 */

document.addEventListener('DOMContentLoaded', ()=>{
    let form = document.getElementById('post_form');
    let title = document.getElementById('postTitle');
    let postContent = CKEDITOR.instances.postContent.getData();
    let submitBtn = document.getElementById('post-submit')
    form.addEventListener('submit', async (event)=>{
        event.preventDefault();
        // Generate a UUID based on the title of the blog post
        if(postContent == ""){
            alert('Cannot pass empty dataset')
            console.error('Cannot pass empty dataset')
            return;
        }else if(title.value.trim() == ""){
            alert('Cannot pass empty dataset')
            console.error('Cannot pass empty dataset')
            return;
        }
        let newBlogPost = {
            title: title.value.trim(),
            body: postContent
        }
        try{
            let response = await fetch('/dashboard/viewposts/createnew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBlogPost)
            })
            if(!response.ok){
                throw new Error('Network response was not ok.')
            }
            window.location.href = "/dashboard/viewpost"
        }catch(err){
            console.error('Error with new post', err)
        }

     
    })
})