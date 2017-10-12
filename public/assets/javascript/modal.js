$("#exampleModal").on("show.bs.modal", function(event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var recipient = button.data("house-id"); // Extract info from data-* attributes
  var address;



  $.get("/api/house/" + recipient, function(house) {
    console.log(house);
    address = house.address;
    Object.keys(house).forEach(column => {
      console.log("column name: ", column, "value: ", house[column]);
    });
    var userChoice = house.User.user_choices;
    choicesArray = userChoice.split("-");
    console.log(choicesArray);

    //update modal
    // var modal = $("#exampleModal");
    var modal = $("#modalForm");
    console.log(modal);
    modal.find(".modal-title").text("Update house at " + house.address);
    modal.find("#id").val(house.id);
    modal.find("#address").val(house.address);
    modal.find("#comments").val(house.comments);
    for (i=0;i<choicesArray.length;i++){
        var choice = choicesArray[i];
        //only need this because handlebars ids are 1st letter caps for some reason
        var upperChoice = choicesArray[i].charAt(0).toUpperCase() + choicesArray[i].substr(1);
        console.log(house[choice]);
        modal.find("#"+upperChoice).val(house[choice]);
      };
    

  });
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
});

$("#modalSubmitButton").on("click", function(e) {
  document.getElementById("modalForm").submit();
});
