// will contain all the shared code by each page.

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
