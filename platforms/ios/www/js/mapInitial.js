function initialMap(){
	$map = L.map('map', {zoomControl: false, attributionControl: false});
	 L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		{
      		maxZoom: 18,
      		minZoom: 10
    	}).addTo($map);
	 if(CurrentLocation){
	 	$map.setView(CurrentLocation, 14);
	 }
	 else{
	 	$map.setView([53.34778,-6.25972], 14);
	 }
}	

function reinitialMap(){
	if(CurrentLocation){
	 	$map.setView(CurrentLocation, 14);
	 }
	 else{
	 	$map.setView([53.34778,-6.25972], 14);
	 }
}

function addLayer(type){
	/*clear markers before adding*/
	console.log('in addLayer');
	if(markers_array.length >=1){
		removeAllMarkers();
	}

	/*detect whehter the layer has been loaded and added in maplayer_array*/
	// if(maplayer_array.length > 0 && maplayer_array.indexOf(type) > -1){
	// 	console.log(type+"in maplayer_array");
	// 	maplayer = L.layerGroup(maplayer_array[type]);
	// 	maplayer.addTo($map);
	// }
	// else {
		console.log(type+" not in maplayer_array");
		therapy_array = getDataAray(type);
		//addMarker(therapy_array);
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
		//var layerObj = {type:[{'type':type, 'array':therapy_array}]};
		//maplayer_array.push(layerObj);
		maplayer = L.layerGroup(markers_array);
		maplayer.type=type;
		
		maplayer.addTo($map);
	//}
	
	//$mapslider.slick('refresh');
	//$cateslider.slick('refresh');
	if($mapslider.is(':visible')){
		$mapslider.slideToggle(200, endLoading);
	}
	else{
		endLoading();
	}
	
	// getUserCurrentLoca	tion();

	function clickOnMarker(e){
		
		
		$map.panTo(e.target.getLatLng(), {animate: true, duration: 0.6});
		//detectSlider();
		//$mapslider.slick('slickGoTo',e.target.sliderIndex);
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
        changeHash: false
    });
	/*detecet whether map is initialized and will not initial in the future*/
    if(typeof($map) == "undefined"){
    	initialMap();
    	console.log("map initialed");
    }
    else{
    	//resetMapPage();
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
			callback(type, getDataAray(type));	
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
        changeHash: false
    });
}

/*load info of the selected therapy*/
function loadProfile(therapy){
	var innerhtml  = "";
	$("#profile_page .ui-header .therapy_county").text(therapy['County/State']+'.'+therapy.Country);
	$("#profile_page .ui-header .therapy_city").text(therapy.City);

	$("#profile_page .therapy_details .therapy_name").text(therapy.Name);
	$("#profile_page .therapy_details .therapy_address").text(therapy['Full Address']);	
	$("#profile_page .therapy_details .therapy_tel").text(therapy['Telephone Number']);	
	if(therapy['Rating']){
		$("#profile_page .therapy_details .therapy_rating").text("Rating: "+therapy['Rating']);	
	}
	if(therapy['Opening hours']){
		var openhour_array = therapy['Opening hours'].split(/\n/);
		for(i in openhour_array){
			innerhtml += openhour_array[i] + "<br />";	
		}
		$("#profile_page .therapy_details .therapy_openhour").html(innerhtml);
	}

}


function switchCategory(callback){
	//var currentSlide = $cateslider.slick('slickCurrentSlide');
	var nextType = $cateslider.children('.slick-list').children('.slick-track').children('.slick-current').attr('data-type');
	$(".loading_wrap").fadeIn(10);
    $.mobile.loading( 'show', {
        	text: 'loading',
        	textVisible: true,
        	theme: 'd',
        	html: ""
   	});
	resetMapPage();
	if(maplayer_array.length > 0 && maplayer_array.indexOf(nextType) > -1){
		maplayer = L.layerGroup(maplayer_array[nextType].array);
		maplayer.addTo($map);
		maplayer.type = nextType;
	}
	else{
		setTimeout(function(){callback(nextType)},50);	
	}
    
    
}


