// each page has it's own javascript file
// common.js contains code that different pages share like button functionality(submitPostButton)

// loads user's posts
$(document).ready(() => {
    // alert("it worked")

    $.get("/api/posts", results => { // results will be send after the request is answered

        // console.log(results)
        outputPosts(results, $(".postsContainer"))
    })
})