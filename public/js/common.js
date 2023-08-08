// will contain all the shared code(functionality one) by each page.



// $(document).ready(() => {
//     // after everything is loaded all components imported etx
// })



// for button as different pages will have buttons that show some functionality
// will fire if some text inside textarea to post otherwise button will be disabled.
// using jquery
$("#postTextarea, #replyTextarea").keyup((event) => { // keyup event will fire when key\board key is released
    // when that happens will pass event property to this function
    var textBox = $(event.target) // will create a javascript object
    var value = textBox.val().trim() // will get rd of spaces before and after
    
    var isModal = textBox.parents(".modal").length == 1 // will already have the textBox from class and check if any of their parent is .modal
    // basically we have diff button for pop up reply to posts hence trying to figure out parent and then button.
    // if have the parent .modal-> lenght will be 1 else 0
    

    var submitButton = isModal ?  $("#submitReplyButton")  : $("#submitPostButton") // jquery object

    if(submitButton.length == 0) return alert("No submit button") // no instance of that id
    if(value == "") {
        submitButton.prop("disabled", true)
        return
    }
    submitButton.prop("disabled", false)
})

// 

$("#submitPostButton, #submitReplyButton").click((event) => {
    var button = $(event.target); 

    var isModal = button.parents(".modal").length == 1 // checking if inside the modal(pop up window for replying)
    var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");

    // info to send to server
    var data = {
        content: textbox.val(),
    }

    if(isModal) {
        // var postId = getPostIdFromElement(button)
        // if(postId == null) return alert("id is null")
        // data.replyTo = postId

        // getting the data-id of the post relying to(adeed as soon as the modal appeared to submit button)
        var id = button.data().id
        if(id == null) return alert("button id is null")
        data.replyTo = id
    }

    // need to submit this post now
    // will make AJAX request which will send data to server without reloading the page
    // submitting a post AJAX request and submit data to specific url
    $.post("/api/posts", data, (postData, status, xhr) => { // xml http request(to check the status of request 200 or 400 etc)
        // a callback function when data is send and when it's done this function will be executed

        // no need to create the post if replying just need a refresh
        if(postData.replyTo) {
            location.reload() // will also see this post when reload happens as this is also a post and updated in database.
        }

        else {
            // console.log(postData) // all parameters inside (postData, status, xhr) received from the rest api
            // postData is basically an object containing all info in Post Schema
            // also contains info about User as populated
            // populated ->  replacing a reference or foreign key in a document with the actual referenced data from another collection.
            var html = createPostHtml(postData)
            // $(".postsContainer").append(html)
            $(".postsContainer").prepend(html)
            textbox.val("")
            button.prop("disabled", true)
        }

    })

})

// new event which fires when the modal is opened(replying to post bootstrap code)
// using a bootstrap event
$("#replyModal").on("show.bs.modal", (event) => {
    // console.log("hi")
    var button = $(event.relatedTarget) // event of .modal being called, it's related to button event being clicked
    var postId =  getPostIdFromElement(button) // can get the post id by knowing the reply button bieng pressed
    
    // will add this id to submit button(inside modal) so that don't search for it again.
    $("#submitReplyButton").data("id", postId) // data method stores on jquery's cache instead of showing but there, can access
    // when will handle click event on that button
    // also can store on button using attr method

    // need to get the post now to show on the pop up for replying to post
    // will get using api
    $.get("/api/posts/" + postId, (results) => {
        // console.log(results)
        outputPosts(results.postData, $("#originalPostContainer")) // expects array 
    })
})

$("#replyModal").on("hidden.bs.modal", (event) => {
    $("#originalPostContainer").html("")
})

$("#deletePostModal").on("show.bs.modal", (event) => {
    // alert("opened")
    var button = $(event.relatedTarget) // event of .modal being called, it's related to button event being clicked
    var postId =  getPostIdFromElement(button) // can get the post id by knowing the reply button bieng pressed
    
    // will add this id to submit button(inside modal) so that don't search for it again.
    $("#deletePostButton").data("id", postId) // data method stores on jquery's cache instead of showing but there, can access
    // when will handle click event on that button
    // also can store on button using attr method
    // basically attaches postId on button 

    // console.log($("#deletePostButton").data().id)

    // need to delete the post now
    // will add a click event handler on delete button basically tp delete the post
    
})

$("#deletePostButton").click((event) => {
    // delete ajax call
    var postId = $(event.target).data("id") // this here refers to the button, generally refers to the element where the event was fired on

    // DELETE method
    $.ajax({
        url: `/api/posts/${postId}`, // to insert javascript variable use back ticks
        type: "DELETE",
        success: (data, status, xhr) => { // data contains what is sent, status contains status msg and xhr helps to find status code
            if(xhr.status != 202) {
                alert("could not delete the post")
                return;
            }
            location.reload()
        }
    })
})


// this won't work as by the time this executes these buttons are not on the page
// dynamic content
// $(".likeButton").click((event) => {
//     alert("button Clicked") 
// })

// instead use document and on and specify the event and on what object(by class or id)
$(document).on("click", ".likeButton", (event) => { // need to updfate the database when like button clicked
    // need to see which user liked the post and update the like list of user as well
    // alert("button clicked") 
    var button = $(event.target)// here it is the <i> tag. not the button html tag
    // here while updating the span to show the likes, used button but button is <i> not html button
    // so updated in main.css pointer-events: none; which means don't register any mouse events on these basically.
    var postId =  getPostIdFromElement(button)
    // console.log(postId)
    
    if(postId === undefined) return

    // AJAX request to update(put request) post
    $.ajax({
        url: `/api/posts/${postId}/like`, // to insert javascript variable use back ticks
        type: "PUT",
        success: (postData) => { // will return updated post upon success
            // console.log(postData)
            // console.log(postData.likes.length)
            // console.log("hurray")

            button.find("span").text(postData.likes.length || "") // button only has 1 span, describes the no. of likes

            if(postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active") // will add active to current button class
            }
            else {
                button.removeClass("active") // if double clicked
            }
        }
    })
})

$(document).on("click", ".retweetButton", (event) => { 
    
    var button = $(event.target)
    var postId =  getPostIdFromElement(button)
    
    if(postId === undefined) return

    // AJAX request to post(retweet is basically to post a post)
    $.ajax({
        url: `/api/posts/${postId}/retweet`, 
        type: "POST",
        success: (postData) => { // will return updated post upon success
            // console.log(postData)
            // console.log(postData.likes.length)
            // console.log("hurray")

            button.find("span").text(postData.retweetUsers.length || "") // button only has 1 span, describes the no. of likes

            if(postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active") // will add active to current button class
            }
            else {
                button.removeClass("active") // if double clicked
            }
        }
    })
})

$(document).on("click", ".post", (event) => { // for post page
    var element = $(event.target)
    var postId = getPostIdFromElement(element)

    if(postId !== undefined && !element.is("button")) { // also mke sure 3 buttons don't take to post page
        // .is in javascript just check the type, so if element is not a button then proceed
        // direct the user to post page
        window.location.href = '/posts/' + postId;
    }
})

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post") // Html of post(root element div has class: post)
    // has been assigned wih post_id as well as data attribute.
    var rootElement = isRoot == true ? element : element.closest(".post") // .closest is a jquery function that goes up to the tree and tries to find the parent with specified character(.post(class))
    // any element of certain class or id will be send like: like button, retweet button
    // in that case require post_id to make changes in server
    // will traverse that hierarchy to get the post-id.
    var postId = rootElement.data().id // .data() gives all the data elements attached to an element, we only have one(id)

    if(postId === undefined) return alert("post id undefined")
    
    return postId
}


function createPostHtml(postData, largeFont = false) { 

    if(postData == null) return alert("post object is null")

    var isRetweet = postData.retweetData !== undefined// will give true for retweeted posts
    // populated retweetData with postData but postData also contains postedBy which also needs to be populated to get the info of the user.
    var retweetedBy = isRetweet ? postData.postedBy.username : null
    postData = isRetweet ? postData.retweetData : postData
    var postedBy = postData.postedBy

    if(postedBy._id === undefined) {
        // it's not the object yet just the object id
        // return alert("user object not populated")
        return console.log("user object not populated")
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName
    // var timestamp = postData.createdAt
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt))

    var likeButtonActiveClass = postData.likes.includes(userLoggedIn ._id) ? "active" : "" // to make sure the color is maintained once the page reloads as well.
    // once the page is load need to know if to show color red or not hence need to add active or not in main.css.
    var retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn ._id) ? "active" : ""
    var largeFontClass = largeFont ? "largeFont" : ""
    var retweetText = ""
    if(isRetweet) {
        retweetText = `<span>
                            <i class='fas fa-retweet'></i>
                            Retweeted By <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>
                        </span>`
    }

    var replyFlag = ""
    if(postData.replyTo && postData.replyTo._id) {

        if(!postData.replyTo._id) {
            return alert("reply to is not populated")
        }
        else if(!postData.replyTo.postedBy._id) { // if postedBy inside replyTo not populated
            return alert("posted By is not populated")
        }

        var replyToUsername = postData.replyTo.postedBy.username
        replyFlag = `<div class='replyFlag'>
                        replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
                    </div>`
    }

    var buttons = ""
    if ( postData.postedBy._id == userLoggedIn._id ) {
        // belongs to the user logged in
        buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fas fa-times'></i></button>`
    }  

    return `<div class='post ${largeFontClass}' data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button data-toggle='modal' data-target='#replyModal'>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweetButton ${retweetButtonActiveClass}'>
                                    <i class='fas fa-retweet'></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>` // this is used to inject variables inside string
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now"
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}


function outputPosts(results, container) {
    container.html("")

    if(!Array.isArray(results)) {
        results = [results]
    }

    results.forEach((result) => { // will loop over each element of results(posts) and provide to anonymous function as result 
        var html = createPostHtml(result)
        container.append(html)
    })

    if(results.lenght == 0) {
        container.append("<span class='noResults'><i>Why So Empty?</i></span>")
    }
}

// rest api badically helps server to interact with database
// for getting notifications or posting anything or messaging or getting the messages etc
// all is done using rest api.
// no role of frontend accept clicking a button etc to send a post request like here


function outputPostsWithReplies(results, container) {
    container.html("")

    if(results.replyTo !== undefined && results.replyTo.__id !== undefined) { // making sure also populated
        var html = createPostHtml(results.replyTo)
        container.append(html)
    }

    var mainPostHtml = createPostHtml(results.postData, true)
    container.append(mainPostHtml)

    results.replies.forEach((result) => { // will loop over each element of results(posts) and provide to anonymous function as result 
        var html = createPostHtml(result)
        container.append(html)
    })

    // if(results.lenght == 0) {
    //     container.append("<span class='noResults'><i>Why So Empty?</i></span>")
    // }
}