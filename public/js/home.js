// each page has it's own javascript file
// common.js contains code that different pages share like button functionality(submitPostButton)

// loads user's posts
$(document).ready(() => {
    // alert("it worked")

    $.get("/api/posts", results => { // results will be send after the request is answered

        console.log(results)
        outputPosts(results, $(".postsContainer"))
    })
})

function outputPosts(results, container) {
    container.html("")

    results.forEach((result) => { // will loop over each element of results(posts) and provide to anonymous function as result 
        var html = createPostHtml(result)
        container.append(html)
    })

    if(results.lenght == 0) {
        container.append("<span class='noResults'><i>Why So Empty?</i></span>")
    }
}