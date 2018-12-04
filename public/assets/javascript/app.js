
$(document).on("click", ".save", function() {
  console.log("Save button clicked!");
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/save/" + thisId
  }).then(function(data) {
    console.log("Data: " + data);
  })

  $(this).html("Saved!");
});
  
$(document).on("click", ".remove", function() {
  console.log("Remove button clicked!");
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/remove/" + thisId
  }).then(function(data) {
    console.log("Data: " + data);
  })

  location.reload()

});
