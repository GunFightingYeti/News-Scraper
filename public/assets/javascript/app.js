
// Added an article to saved
$(document).on("click", ".save", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/save/" + thisId
  }).then(function(data) {
  })

  $(this).html("Saved!");
});
  
// Remove an article from saved
$(document).on("click", ".remove", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/remove/" + thisId
  }).then(function(data) {
  })

  location.reload()

});
