function initialMap(){
	$map = L.map('map', {zoomControl: false, attributionControl: false});
	 L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		{
      		maxZoom: 18,
      		minZoom: 10
    	}).addTo($map);
	 $map.setView(CurrentLocation, 15);
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
	// getUserCurrentLoca	tion();

	function clickOnMarker(e){
		
		if($map.getZoom() < 15){
			$map.panTo(e.target.getLatLng(), {animate: true, duration: 0.6});
			// zoom the map to a suitable number
			setTimeout(function(){$map.setZoom(15);},350);
		}
		else{
			$map.panTo(e.target.getLatLng(), {animate: true, duration: 0.6});
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
	if(CurrentLocation.length !=0)
	{
		/*detect whether currentlocation marker exists before adding if exists panto the marker, if not adding and panto*/
		if(CurrentLocation_array.length == 0){
			var CurrentLocationMarker = L.marker(CurrentLocation,{icon:myIcon}).bindPopup("You are here");
			CurrentLocation_array.push(CurrentLocationMarker);
			CurrentLocationLayer = L.layerGroup(CurrentLocation_array).addTo($map);
		}
		else{
			console.log('CurrentLocation marker exists');
		}
		$map.panTo(CurrentLocation_array[0].getLatLng(), {animate: true, duration: 0.5});
		setTimeout(function(){CurrentLocation_array[0].openPopup();},300);
		
    }	
    else{
    	alert("Sorry, can't get your location now.");
    }
}


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
        case "ciropodist" :
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
}

/*load info of the selected therapy*/
function loadProfile(therapy){
	$("#profile_page .ui-header .therapy_county").text(therapy['County/State']+'.'+therapy.Country);
	$("#profile_page .ui-header .therapy_city").text(therapy.City);

	$("#profile_page .therapy_details .therapy_name").text(therapy.Name);
	$("#profile_page .therapy_details .therapy_address").text(therapy['Full Address']);	
	$("#profile_page .therapy_details .therapy_tel").text(therapy['Telephone Number']);	

}



