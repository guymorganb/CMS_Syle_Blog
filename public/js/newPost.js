/**
 * .js to send the new post from the dashboard to the server for storage
 */

document.addEventListener('DOMContentLoaded', ()=>{
    let form = document.getElementById('post_form');
    let title = document.getElementById('postTitle');
    let loading = document.getElementById('loading'); 
    // make sure your not connecting your html elemet to the CKEDITOR more than once
    // or it will throw errrors
    let editor;
    if (CKEDITOR.instances.postContent) {
        editor = CKEDITOR.instances.postContent;
    } else {
        editor = CKEDITOR.replace('postContent');
    }

    let postContent = editor.getData();

    editor.on( 'change', function( evt ) {
        postContent = evt.editor.getData();
    });

    form.addEventListener('submit', async (event)=>{
        event.preventDefault();
        loading.style.display = 'block';
        if(postContent.trim() == "" || title.value.trim() == ""){
            alert('Cannot pass empty dataset')
            console.error('Cannot pass empty dataset')
            return;
        }
        let newBlogPost = {
            title: title.value.trim(),
            body: postContent
        }
        console.log('your post: ',newBlogPost)
        
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
            // send user to /viewposts in the dashboard
            setTimeout(() => {
                window.location.href = "/dashboard/viewposts";
                loading.style.display = 'none';
            }, 500);
        }catch(err){
            console.error('Error with new post', err)
        }
    })
})

