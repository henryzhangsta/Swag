function getHomeData(event) {
	event.preventDefault();
	if (($("#radio_single").is(":checked") || $("#radio_family").is(":checked")) && $("#textBox_address").val().trim().length > 0 && $("#textBox_city").val().trim().length > 0 && $("#textBox_zip").val().trim().length > 0){
		var address = $("#textBox_address").val() + " " + $("#textBox_city").val() + ", " + $("#states").val() + " " + $("#textBox_zip").val();
		specs = {
			address: address,
			placeTypes: ['school', 'food', 'park'],
			icons: {
				school: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
				food: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
				park: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
			},
			resultCallback: function (resultDict) {
				if (success) {
					console.log(resultDict.park[0].rating);
					$("#infoPanel .infoPanelTab").off().on("click", function(){$("#infoPanel").toggleClass("hidden");});
					//Populate data
					$("#infoPanel").toggleClass("hidden");
				}
			}
		};

		init(specs);
	}
}