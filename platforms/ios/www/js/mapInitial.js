function initialMap(){
//var map = L.map('map').setView([53.3478, -6.2579], 14);
	var map = L.map('map');
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




	console.log('before marker');
	var marker = L.marker(marker_1,{icon: myIcon}).bindPopup('Liffey RIver </br>'+ marker_1.distanceTo(center).toFixed(0) +' m' )
				  .on('click', function(){map.panTo(marker.getLatLng());}).addTo(map);
	



}



