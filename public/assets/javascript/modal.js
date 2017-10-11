$("#exampleModal").on("show.bs.modal", function(event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var recipient = button.data("house-id"); // Extract info from data-* attributes
  var address;



  $.get("/api/house/" + recipient, function(house) {
    console.log(house);
    address = house.address;
    Object.keys(house).forEach(column => {
      console.log("column name: ", column, "value: ", house[column]);

    })

    $.get("api/user/"+ house.UserId, function(user){
      console.log(user);
      //user choice into array
      //loop through array
      // house[userchoice[i]] = value for user specified columns
    })

    //update modal
    var modal = $("#exampleModal");
    console.log(modal);
    modal.find(".modal-title").text("Update house at " + house.address);
    modal.find("#id").val(house.id);
    modal.find("#address").val(house.address);
    modal.find("#comments").val(house.comments);
    

  });
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
});

$("#modalSubmitButton").on("click", function(e) {
  document.getElementById("modalForm").submit();
});
