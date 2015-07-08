function initialMap(){
	//var map = L.map('map').setView([53.3478, -6.2579], 14);
	map = L.map('map', {zoomControl: false, attributionControl: false});
	var myIcon = L.icon({
    			iconUrl: 'icon/location-dark.svg',
    			iconRetinaUrl: 'icon/location-dark.svg',
    			iconSize: [30, 30],

			});
	
	 L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		{
      		maxZoom: 18,
      		minZoom: 10
    	}).addTo(map);
	 map.setView([53.3478, -6.2579], 12);
}	


function addLayer(type){
	if(markers_array.length >=1){
		removeAllMarkers();
	}
	/* add markers to layer and then add layer to markers*/
	if(type == 'acupuncturist' ){
		var store_array = acupuncturist_array;
	}
	//console.log('before marker');
	for(var i = 0; i< store_array.length;i++){
		var position = [store_array[i].Latitude,store_array[i].Longitude];
		//console.log(position);
		var div='';
		var marker = L.marker(position,{icon:myIcon}).bindPopup(store_array[i].Name).on('click',clickOnMarker);
		marker.sliderIndex = i;
		//marker.addTo(maplayer);
		markers_array.push(marker);
		div += '<div><a href="#detail_page" data-transition="slide"><div class="detail_content"><div class="col-xs-3"><img class="img-circle"></img></div><div class="col-xs-9"><label>'+store_array[i].Name+'</label><label>'+store_array[i]['Full Address']+'</label></div></div></a></div>';
		$mapslider.slick('slickAdd',div);
	}
	

	var maplayer = L.layerGroup(markers_array).addTo(map);
	$mapslider.slideToggle(200, endLoading);
	
	//callback(endLoading);
	function onLocationFound(e) {
    	// create a marker at the users "latlng" and add it to the map
   	 	L.marker(e.latlng,{icon:myIcon}).bindPopup('my current location').addTo(map);
	}

	function clickOnMarker(e){
		
		if(map.getZoom() < 14){
			map.panTo(e.target.getLatLng(), {animate: true, duration: 0.5});
			// zoom the map to a suitable number
			setTimeout(function(){map.setZoom(14);},350);
		}
		else{
			map.panTo(e.target.getLatLng(), {animate: true, duration: 0.5});
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

	function loadProfilePage(therapy){
		
	}
	/*find marker by swipe on the slider and the popup is then open*/
	$mapslider.on('swipe', function(e){
		var currentindex =$mapslider.slick('slickCurrentSlide');
		
		map.panTo(markers_array[currentindex].getLatLng(),{animate: true, duration: 0.5});
		setTimeout(function(){markers_array[currentindex].openPopup();},300);
		
		
	});
}

function getUserCurrentLocation(lat,long)
{
	var user_location = [latitude, longitude];
	//var user_location = getUserCurrentCoordinate();
	//console.log(user_location);

		var myIcon = L.icon
			({
    			iconUrl: 'icon/location-dark.svg',
    			iconRetinaUrl: 'icon/location-dark.svg',
    			iconSize: [30, 30],

			});

		
		map.panTo(user_location);
		L.marker(user_location,{icon:myIcon}).addTo(map).bindPopup("You are here").openPopup();

		alert("Sorry, cannot find your location now.")
	
	

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

}

function getUserCurrentCoordinate(){
	console.log('before get coordinate');
	var options = { enableHighAccuracy: true };
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);

	function onSuccess(position){
        //getUserCurrentLocation(position.coords.latitude , position.coords.longitude);
        //var coordinate = [position.coords.latitude, position.coords.longitude];
        getUserCurrentLocation(position.coords.latitude, position.coords.longitude);
        console.log(position.coords.latitude+' '+ position.coords.longitude);
        //console.log(coordinate);
        //return coordinate;
    }

    function onError(error) {
         alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
}	

function startLoading(type, callback){
	$.mobile.loading( 'show', {
		text: 'loading',
		textVisible: true,
		theme: 'd',
		html: ""
	});
	$(".loading_wrap").fadeIn(200);
	callback(type);
}

function endLoading(){
	$.mobile.loading('hide');
	$(".loading_wrap").fadeOut();

}


