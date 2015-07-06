function initialMap(){
	//var map = L.map('map').setView([53.3478, -6.2579], 14);
	map = L.map('map', {zoomControl: false, attributionControl: false});
	var myIcon = L.icon({
    			iconUrl: 'icon/location-dark.svg',
    			iconRetinaUrl: 'icon/location-dark.svg',
    			iconSize: [30, 30],

			});

	// var myIcon = L.divIcon({className: 'my-divIcon', html:"1 hour 30 min",iconSize:[100,20] });
	// var center = L.latLng(53.3478, -6.2579);
	var marker_1 = L.latLng(53.3468, -6.257);
	console.log("before initial tileLayer");
	L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		{
      		maxZoom: 18,
      		minZoom: 10
    	}).addTo(map);
	console.log('after initial tileLayer');
	map.setView([53.3478, -6.2579], 14);

	var store_array = [
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
		},
		{
			latlng: [53.3390, -6.2577],
			title: 'marker-5'
		},
		{
			latlng: [53.3468, -6.2575],
			title: 'marker-6'
		},
		];
	console.log('before marker');
	for(var i = 0; i< store_array.length;i++){

		var div='';
		//console.log(markers_array[i].latlng);
		var marker =   L.marker(store_array[i].latlng,{icon:myIcon}).bindPopup(store_array[i].title).on('click',clickOnMarker);
		marker.sliderIndex = i;
		marker.addTo(map);
		markers_array.push(marker);
		console.log('before add into slick');
		div += '<div><a href="#detail_page" data-transition="slide"><div class="detail_content"><div class="col-xs-4"><img class="img-circle"></img></div><div class="col-xs-8"><label>'+store_array[i].latlng+'</label><label>'+store_array[i].title+'</label></div></div></a></div>';
		$mapslider.slick('slickAdd',div);
	}
	$mapslider.slideToggle(200);
	function onLocationFound(e) {
    	// create a marker at the users "latlng" and add it to the map
   	 	L.marker(e.latlng,{icon:myIcon}).bindPopup('my current location').addTo(map);
	}

	function clickOnMarker(e){
		
		if(map.getZoom() <= 15){
			map.panTo(e.target.getLatLng());
			// zoom the map to a suitable number
			setTimeout(function(){map.setZoom(16);},200);
		}
		else{
			map.panTo(e.target.getLatLng());
		}
		detectSlider();
		$mapslider.slick('slickGoTo',e.target.sliderIndex);
	}
	
	/*detect whether the slider is visible when click on any marker on the map*/
	function detectSlider(){
		if($mapslider.is(":visible")){
			return;
		}
		else{
			$mapslider.slideToggle(300);
		}
	}

	/*find marker by swipe on the slider and the popup is then open*/
	$mapslider.on('swipe', function(e){
		var currentindex =$mapslider.slick('slickCurrentSlide');
		//console.log("current index: "+currentindex);
		/*openPopup() should ahead of panTo() and the latter function takes a delay in animation*/
		markers_array[currentindex].openPopup();
		map.panTo(markers_array[currentindex].getLatLng());
		
	});
}

function getUserCurrentLocation(latitude, longitude)
{
	var user_location = [latitude, longitude];

	var myIcon = L.icon
			({
    			iconUrl: 'icon/location-dark.svg',
    			iconRetinaUrl: 'icon/location-dark.svg',
    			iconSize: [30, 30],

			});

	L.marker(user_location,{icon:myIcon}).addTo(map).bindPopup("You are here").openPopup();

}

function getUserLocation(){
	console.log('before locate');
	var myIcon = L.icon({
    			iconUrl: 'icon/location-dark.svg',
    			iconRetinaUrl: 'icon/location-dark.svg',
    			iconSize: [30, 30],

			});
	map.locate({setView: true, maxZoom: 16});
	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	function onLocationError(e) {
    	alert(e.message);
    	console.log('location error');
	}

	function onLocationFound(e) {
		console.log('lcation found');
    	L.marker(e.latlng,{icon:myIcon}).addTo(map).bindPopup("You are here").openPopup();
    	map.panTo(e.latlng);
	}


	
	// var options = {maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
	// navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	
	// function onSuccess(position){
	// 	console.log(JSON.stringify(position));
	// }
	// function onError(error){
	// 	console.log(error);
	// }
    
     console.log('after locate');
	// navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
	// function geolocationSuccess(position){
	// 	 console.log('Latitude: '          + position.coords.latitude          + '\n' +
 //          'Longitude: '         + position.coords.longitude         + '\n' +
 //          'Altitude: '          + position.coords.altitude          + '\n' +
 //          'Accuracy: '          + position.coords.accuracy          + '\n' +
 //          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
 //          'Heading: '           + position.coords.heading           + '\n' +
 //          'Speed: '             + position.coords.speed             + '\n' +
 //          'Timestamp: '         + position.timestamp                + '\n');
	// };

	// function geolocationError(error){
	// 	console.log('code: '+ error.code+ '\n' +'message: ' + error.message + '\n');
	// }
}



function alertDismissed() {
            // do something
        }

    // Show a custom alertDismissed
    //
    function showAlert() {
        navigator.notification.alert(
            'You are the winner!',  // message
            alertDismissed,         // callback
            'Game Over',            // title
            'Done'                  // buttonName
        );
    }


