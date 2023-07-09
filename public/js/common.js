// will contain all the shared code(functionality one) by each page.



// $(document).ready(() => {
//     // after everything is loaded all components imported etx
// })



// for button as different pages will have buttons that show some functionality
// will fire if some text inside textarea to post otherwise button will be disabled.
// using jquery
$("#postTextarea").keyup((event) => { // keyup event will fire when key\board key is released
    // when that happens will pass event property to this function
    var textBox = $(event.target) // will create a javascript object
    var value = textBox.val().trim() // will get rd of spaces before and after
    
    var submitButton = $("#submitPostButton") // jquery object

    if(submitButton.length == 0) return alert("No submit button") // no instance of that id
    if(value == "") {
        submitButton.prop("disabled", true)
        return
    }
    submitButton.prop("disabled", false)
})

// 

$("#submitPostButton").click((event) => {
    var button = $(event.target);
    var textbox = $("#postTextarea");

    // info to send to server
    var data = {
        content: textbox.val(),
    }
    // need to submit this post now
    // will make AJAX request which will send data to server without reloading the page
    // submitting a post AJAX request and submit data to specific url
    $.post("/api/posts", data, (postData, status, xhr) => { // xml http request(to check the status of request 200 or 400 etc)
        // a callback function when data is send and when it's done this function will be executed
        // console.log(postData) // all parameters inside (postData, status, xhr) received from the rest api
        // postData is basically an object containing all info in Post Schema
        // also contains info about User as populated
        // populated ->  replacing a reference or foreign key in a document with the actual referenced data from another collection.
        var html = createPostHtml(postData)
        $(".postsContainer").append(html)
        textbox.val("")
        button.prop("disabled", true)
    })

})

// this won't work as by the time this executes these buttons are not on the page
// dynamic content
// $(".likeButton").click((event) => {
//     alert("button Clicked") 
// })

// instead use document and on and specify the event and on what object(by class or id)
$(document).on("click", ".likeButton", () => {
    alert("button clicked")
})


function createPostHtml(postData) {
    
    var postedBy = postData.postedBy

    if(postedBy._id === undefined) {
        // it's not the object yet just the object id
        // return alert("user object not populated")
        return console.log("user object not populated")
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName
    // var timestamp = postData.createdAt
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt))


    return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button class='likeButton'>
                                    <i class='far fa-heart'></i>
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

// rest api badically helps server to interact with database
// for getting notifications or posting anything or messaging or getting the messages etc
// all is done using rest api.
// no role of frontend accept clicking a button etc to send a post request like here
