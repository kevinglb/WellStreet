function initialMap(){
//var map = L.map('map').setView([53.3478, -6.2579], 14);
	var map = L.map('map', {zoomControl: false, attributionControl: false});
	var myIcon = L.icon({
    			iconUrl: 'icon/location-dark.svg',
    			iconRetinaUrl: 'icon/location-dark.svg',
    			iconSize: [30, 30],

			});
	var center = L.latLng(53.3478, -6.2579);
	var marker_1 = L.latLng(53.3468, -6.257);
	console.log("before initial tileLayer");
	L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		{
      		maxZoom: 18,
      		minZoom: 10
    	}).addTo(map);
	console.log('after initial tileLayer');

	//map.locate() will crash on mobile
	map.setView([53.3478, -6.2579], 14);


	// function onLocationFound(e) {
 //    	var radius = e.accuracy / 2;

	//     L.marker(e.latlng).addTo(map)
 //    	 .bindPopup("You are within " + radius + " meters from this point").openPopup();

 //    	L.circle(e.latlng, radius).addTo(map);
	// }

	// map.on('locationfound', onLocationFound);
	var markers_array = [
		{
			latlng: [53.3478, -6.2579],
			title: 'marker-1'
		},
		{
			latlng: [53.3468, -6.2589],
			title: 'marker-2'
		},
		{
			latlng: [53.3448, -6.2599],
			title: 'marker-3'
		},
		{
			latlng: [53.3472, -6.2579],
			title: 'marker-4'
		}];
	console.log('before marker');
	for(var i = 0; i< markers_array.length;i++){
		var div='';
		console.log(markers_array[i].latlng);
		var marker =   L.marker(markers_array[i].latlng,{icon:myIcon}).bindPopup(markers_array[i].title).on('click',clickOnMarker);
		marker.sliderIndex = i;
		marker.addTo(map);
		console.log('before add into slick');
		div += '<div class="detail_content"><a href="#detail_page" data-transition="slide"><label>'+markers_array[i].latlng+'</label><label>'+markers_array[i].title+'</label></a></div>';
		$("#detail_slider").slick('slickAdd',div);
	}

	function clickOnMarker(e){
		map.setZoom(16);
		detectSlider();
		map.panTo(e.target.getLatLng());
		$("#detail_slider").slick('slickGoTo',e.target.sliderIndex);
	}
	
	function detectSlider(){
		if($("#detail_slider").is(":visible")){
			return;
		}
		else{
			$("#detail_slider").fadeIn();
		}
	}

	
}



