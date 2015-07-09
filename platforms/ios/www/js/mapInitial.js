function initialMap(){
	//var map = L.map('map').setView([53.3478, -6.2579], 14);
	$map = L.map('map', {zoomControl: false, attributionControl: false});
	// var myIcon = L.icon({
 //    			iconUrl: 'icon/location-dark.svg',
 //    			iconRetinaUrl: 'icon/location-dark.svg',
 //    			iconSize: [30, 30],

	// 		});
	 L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		{
      		maxZoom: 18,
      		minZoom: 10
    	}).addTo($map);
	 $map.setView([53.3478, -6.2579], 12);
}	


function addLayer(DataArray){
	/*clear markers before adding*/
	console.log('in addLayer');
	if(markers_array.length >=1){
		removeAllMarkers();
	}

	therapy_array = DataArray;
	//console.log('before marker');
	for(var i = 0; i< therapy_array.length;i++){
		var position = [therapy_array[i].Latitude,therapy_array[i].Longitude];

		//console.log(position);
		var div='';
		var marker = L.marker(position,{icon:myIcon}).bindPopup(therapy_array[i].Name).on('click',clickOnMarker);
		marker.sliderIndex = i;
		//marker.addTo(maplayer);
		markers_array.push(marker);
		div += '<div class="detail_content" onclick="getTherapy(loadProfile)"><div class="col-xs-3"><img class="img-circle"></img></div><div class="col-xs-9"><label>'+therapy_array[i].Name+'</label><label>'+therapy_array[i]['Full Address']+'</label></div></div>';
		$mapslider.slick('slickAdd',div);
	}
	maplayer = L.layerGroup(markers_array).addTo($map);
	$mapslider.slideToggle(200, endLoading);


	
	//callback(endLoading);
	function onLocationFound(e) {
    	// create a marker at the users "latlng" and add it to the map
   	 	L.marker(e.latlng,{icon:myIcon}).bindPopup('my current location').addTo(map);
	}

	function clickOnMarker(e){
		
		if($map.getZoom() < 14){
			$map.panTo(e.target.getLatLng(), {animate: true, duration: 0.5});
			// zoom the map to a suitable number
			setTimeout(function(){$map.setZoom(14);},350);
		}
		else{
			$map.panTo(e.target.getLatLng(), {animate: true, duration: 0.5});
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
		var currentindex = $mapslider.slick('slickCurrentSlide');
		
		$map.panTo(markers_array[currentindex].getLatLng(),{animate: true, duration: 0.5});
		setTimeout(function(){markers_array[currentindex].openPopup();},300);
	});

	
}

function getUserCurrentLocation()
{
	if(latitude != null && longitude != null)
	{
		var user_location = [latitude, longitude];
    
    	var myIcon = L.icon
		({
    		iconUrl: 'icon/location-dark.svg',
    		iconRetinaUrl: 'icon/location-dark.svg',
    		iconSize: [30, 30],

		});

		
		$map.panTo(user_location);
		L.marker(user_location,{icon:myIcon}).addTo($map).bindPopup("You are here").openPopup();
<<<<<<< HEAD
    }, function() {
        alert("Sorry, cannot get your location now.");                                     
    }, { maximumAge: 10000, timeout: 1000, enableHighAccuracy: true });
	// var myIcon = L.icon
	// 	({
 //    			iconUrl: 'icon/location-dark.svg',
 //    			iconRetinaUrl: 'icon/location-dark.svg',
 //    			iconSize: [30, 30],

	// 		});

		
	// 	map.panTo(user_location);
	// 	L.marker(user_location,{icon:myIcon}).addTo(map).bindPopup("You are here").openPopup();

		// alert("Sorry, cannot find your location now.")
		
}

function getUserLocation(){
	console.log('before locate');
	var myIcon = L.icon({
    			iconUrl: 'icon/location-dark.svg',
    			iconRetinaUrl: 'icon/location-dark.svg',
    			iconSize: [30, 30],

			});
	$map.locate({setView: true, maxZoom: 16});
	$map.on('locationfound', onLocationFound);
	$map.on('locationerror', onLocationError);

	function onLocationError(e) {
    	alert(e.message);
    	console.log('location error');

	}
	else
	{
		alert("Please check your network and try again :(");         
	}

}

// function getUserCurrentLocation()
// {
// 	navigator.geolocation.getCurrentPosition(function(position) {
//         var user_location = [position.coords.latitude, position.coords.longitude];
//         var myIcon = L.icon
// 		({
//     		iconUrl: 'icon/location-dark.svg',
//     		iconRetinaUrl: 'icon/location-dark.svg',
//     		iconSize: [30, 30],

// 		});

		
// 		$map.panTo(user_location);
// 		L.marker(user_location,{icon:myIcon}).addTo($map).bindPopup("You are here").openPopup();
//     }, function(e) 
//     {
//     	alert(e.code + " " + e.message);
//         alert("Sorry, cannot get your location now.");                                     
//     }, { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
// }

// function getUserLocation(){
// 	console.log('before locate');
// 	var myIcon = L.icon({
//     			iconUrl: 'icon/location-dark.svg',
//     			iconRetinaUrl: 'icon/location-dark.svg',
//     			iconSize: [30, 30],

// 			});
// 	$map.locate({setView: true, maxZoom: 16});
// 	$map.on('locationfound', onLocationFound);
// 	$map.on('locationerror', onLocationError);

// 	function onLocationError(e) {
//     	alert(e.message);
//     	console.log('location error');
// 	}

// 	function onLocationFound(e) {
// 		console.log('lcation found');
//     	L.marker(e.latlng,{icon:myIcon}).addTo($map).bindPopup("You are here").openPopup();
//     	$map.panTo(e.latlng);
// 	}

// }

// function getUserCurrentCoordinate(){
// 	console.log('before get coordinate');
// 	var options = { enableHighAccuracy: true };
	
// 	navigator.geolocation.getCurrentPosition(onSuccess, onError);

// 	function onSuccess(position){
//         getUserCurrentLocation(position.coords.latitude, position.coords.longitude);
//         console.log(position.coords.latitude+' '+ position.coords.longitude);
      
//     }

//     function onError(error) {
//          console.log('code: '    + error.code    + '\n' +
//               'message: ' + error.message + '\n');
//     }
// }	

function startLoadMapPage(type, callback){
	//console.log(type);
	//console.log('before load wrap');
	$.mobile.changePage("#map_page", 
    {
        transition: "slide",
        changeHash: true
    });
	/*detecet whether map is initialized and will not initial in the future*/
    if(typeof($map) == "undefined"){
    	initialMap();
    	console.log("map initialed");
    }
    else{
    	resetMapPage();
    	console.log("map reseted");
    }
    $(".loading_wrap").fadeIn(200);
    $.mobile.loading( 'show', {
			text: 'loading',
			textVisible: true,
			theme: 'd',
			html: ""
		});
    $("#map_page").one('pageshow', function(){
		if(type){
			console.log('before call back');
			callback(getDataAray(type));	
		}
		else{
			endLoading();
			alert("failed in loading data");	
		}
    });
   // return false;

}

function endLoading(){
	$.mobile.loading('hide');
	$(".loading_wrap").fadeOut(200);
}

/*return array based on the type*/
function getDataAray(type){
	var DataArray;
	console.log("before switch");
	console.log(type);
	switch (type) 
    {
        case "acupuncturist": 
        	DataArray = acupuncturist_array;
        	break;
        case "allergy": 
        	DataArray = allergy_array;
        	break;
        case "aromatherapist": 
        	DataArray = aromatherapist_array;
        	break;
        case "chiropodist" :
        	DataArray = chiropodist_array;
        	break;
        case "chiropractor" :
        	DataArray = chiropractor_array;
        	break;
    }   

    return DataArray;
}

/*get the therapy based on the index of the slider and pass it as paramter to callback*/
function getTherapy(callback){
	var index = $mapslider.slick('slickCurrentSlide');
	var therapy = therapy_array[index];
	callback(therapy);
	$.mobile.changePage("#profile_page", 
    {
        transition: "slide",
        changeHash: true
    });
	console.log(JSON.stringify(therapy));
	//return false;
}

/*load info of the selected therapy*/
function loadProfile(therapy){
	$("#profile_page .ui-header .therapy_county").text(therapy['County/State']+'.'+therapy.Country);
	$("#profile_page .ui-header .therapy_city").text(therapy.City);

	$("#profile_page .therapy_details .therapy_name").text(therapy.Name);
	$("#profile_page .therapy_details .therapy_address").text(therapy['Full Address']);
	
}

function showLocation(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            alert("Latitude : " + latitude + " Longitude: " + longitude);
}
function errorHandler(err) {
            if(err.code == 1) {
               alert("Error: Access is denied!");
            }else if( err.code == 2) {
               alert("Error: Position is unavailable!");
            }
         }
			
function getLocation(){
	console.log("in get location");
            if(navigator.geolocation){
               // timeout at 60000 milliseconds (60 seconds)
               console.log('in');
               var options = { maximumAge: 10000, timeout: 30000, enableHighAccuracy: true }
               navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
            }else{
               alert("Sorry, browser does not support geolocation!");
            }
}
