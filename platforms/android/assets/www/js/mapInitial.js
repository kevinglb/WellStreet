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
		div += '<div><a href="#detail_page" data-transition="slide"><div  class="detail_content"><label>'+markers_array[i].latlng+'</label><label>'+markers_array[i].title+'</label></div></a></div>';
		$("#detail_slider").slick('slickAdd',div);
	}
 
	function onLocationFound(e) {
    	// create a marker at the users "latlng" and add it to the map
   	 	L.marker(e.latlng,{icon:myIcon}).bindPopup('my current location').addTo(map);
	}

	function clickOnMarker(e){
		//map.setZoom(16);

		if(map.getZoom() <= 15){
			map.panTo(e.target.getLatLng());
			setTimeout(function(){map.setZoom(16);},200);
			
		}
		else{
			map.panTo(e.target.getLatLng());
		}


		detectSlider();
		
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

	// $(".slick-slide").on(clickOrTouch, function(e){
	// 	var element = e.target;
	// 	console.log(element.toString());
	// 	$.mobile.changePage("#detail_page", 
 //        {
 //            transition: "slide",
 //            reverse: false,
 //            changeHash: true
 //        });
	// })

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


