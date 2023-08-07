$(document).ready(() => {

    $.get("/api/posts/" + postId, results => { // results will be send after the request is answered
        outputPostsWithReplies(results, $(".postsContainer"))
    })
})