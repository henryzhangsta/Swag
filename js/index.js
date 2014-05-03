function getHomeData(event) {
	event.preventDefault();
	if (($("#radio_single").is(":checked") || $("#radio_family").is(":checked")) && $("#textBox_address").val().trim().length > 0 && $("#textBox_city").val().trim().length > 0 && $("#textBox_zip").val().trim().length > 0){
		var address = $("#textBox_address").val() + " " + $("#textBox_city").val() + ", " + $("#states").val() + " " + $("#textBox_zip").val();
        
		if ($("#radio_single").is(":checked"))
        {
            startSingleMap(address);
        }
        else
        {
            startFamilyMap(address);
        }
	}
}

function updateScore(score) {
    if (score < 40) {
        $("#imgFace").attr("src", "/img/Emoticons-Sad-icon.png");
        $("#rating").attr("class", "low");
    } else if (score < 70) {
        $("#imgFace").attr("src", "/img/Emoticons-Question-icon.png");
        $("#rating").attr("class", "medium");
    } else {
        $("#imgFace").attr("src", "/img/Emoticons-Happy-icon.png");
        $("#rating").attr("class", "high");
    }
    $("#rating").text(Math.round(score));
    $("#infoPanel .infoPanelTab").off().on("click", function(){$("#infoPanel").toggleClass("hidden");});
	$("#infoPanel").removeClass("hidden");
}