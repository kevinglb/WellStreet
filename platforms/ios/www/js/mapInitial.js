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
	$map.on('moveend',updateLayer);
}	

/*reinitialMap after resetMap()*/
function reinitialMap(){
	if(CurrentLocation){
	 	$map.setView(CurrentLocation, 14);
	 }
	 else{
	 	$map.setView([53.34778,-6.25972], 14);
	 }
}

/*function for adding new layer on the map*/
function addLayer(type,callback){
	if(markers_array.length >=1){
		removeAllMarkers();
	}

	therapy_array = getDataAray(type);
	callback(therapy_array);
	for(var i = 0,len=therapy_array.length; i< len;i++){
		var position = L.latLng(therapy_array[i].Latitude, therapy_array[i].Longitude);
		var marker = new WSMarker(position,
			{
				icon:myIcon,
				index: i, 
				name:therapy_array[i].Name,
				address:therapy_array[i]['Full Address']
			}).bindPopup(therapy_array[i].Name,{autoPan:false})
			  .on('click',clickOnMarker);
		//marker.options.name = therapy_array[i].Name;
		//marker.options.address = therapy_array[i]['Full Address'];
		marker.sliderIndex = i;
		markers_array.push(marker);
	}
	console.timeEnd('addlayer loop');
	maplayer = L.layerGroup(markers_array);
	maplayer.type=type;
	maplayer.addTo($map);
	endLoading();
		
	//$detailslider.slick('refresh');
	//$cateslider.slick('refresh');
	if($detailslider.is(':visible')){
		$detailslider.slideToggle(200, endLoading);
	}
	else{
		endLoading();
	}
	updateDetailSlider();
}

//add brief info of selected marker into $detailslider
function clickOnMarker(e){	
	toggleSliders();
	$detailslider.children('.slick-list').children('.slick-track').children('.slick-slide').each(function(){
		console.log($(this).attr('data-index'));
		if($(this).attr('data-index') == e.target.sliderIndex){
			var index = $(this).attr("data-slick-index");
			$detailslider.slick('slickGoTo',parseInt(index));
		}
	});
}

/*detect whether the slider is visible when click on any marker on the map*/
function toggleSliders(){
	if($cateslider.is(":visible") && $detailslider.is(":hidden") ){
		$cateslider.slideToggle(200);
		$detailslider.slideToggle(200);
		//updateDetailSlider();
	}
		//$detailslider.slideToggle(300);
	else{
		return;
	}
}

function getUserCurrentLocation()
{
	if(CurrentLocation.length !=0)
	{
		//var currentIcon = L.divIcon({className: 'my-divIcon', html:"You are here",iconSize:[100,0] });
		//var currentIcon =new  L.WSDivIcon({html: 'You are here'});
		/*detect whether currentlocation marker exists before adding if exists panto the marker, if not adding and panto*/
		if(CurrentLocation_array.length == 0){
			var CurrentLocationMarker = L.marker(CurrentLocation,{icon: myIcon}).bindPopup('You Are Here',{autoPan:false});
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
	$.mobile.changePage("#map_page", 
    {
        transition: "slide",
        changeHash: false
    });
	/*detecet whether map is initialized and will not initial in the future*/
    if(typeof($map) == "undefined"){
    	initialMap();
    }
    else{
    	reinitialMap();
    }
    $(".loading_wrap").fadeIn(100);
    $.mobile.loading( 'show', {
			text: 'loading',
			textVisible: true,
			theme: 'd',
			html: ""
		});
    initialDetailSlider();
    $("#map_page").one('pageshow', function(){
		if(type){
			//detect whether the $cateslider has initialized already
			//if is not initialized it, otherwise goto the selected slide of type
			console.time('cateslider');
			if(!$cateslider.hasClass('slick-initialized')){
           		initialCateSlider();
			}
          	var	index;
            $cateslider.children('.slick-list').children('.slick-track').children('.slick-slide').each(function(){
            	if($(this).attr("data-type") == type){
            		index = $(this).attr('data-index');
            	}
            });
            $cateslider.slick('slickGoTo',index);
			callback(type, addList);	
			console.timeEnd('cateslider');
		}
		else{
			endLoading();
			alert("failed in loading data");	
		}
    });
   //return false;
}

function endLoading(){
	$.mobile.loading('hide');
	$(".loading_wrap").fadeOut(150);
}

/*return array based on the type*/
function getDataAray(type){
	var DataArray;
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

//get the index of the therapy in the array and then load profile(now it is a common function)
function getTherapy(element, callback){
	// var index = $detailslider.slick('slickCurrentSlide');
	var currentindex = $(element).attr('data-index');
	var therapy = therapy_array[currentindex];
	callback(therapy);
	changePage("profile_page", "slide");	
}

//load info of the selected therapy
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

//change the layer on the marker when category has been changed on the $cateslider
function switchCategory(callback){
	var nextType = $cateslider.children('.slick-list').children('.slick-track').children('.slick-current').attr('data-type');
	//determine whether the category has been changed
	if(nextType == maplayer.type){
		return;
	}
	else{
		resetMapPage();
		callback(nextType,addList);
	}
	reinitialMap();
}

function addList(DataArray){
	var div='';
	for(var i = 0,len=DataArray.length; i< len;i++){
		div += '<div class="therapy_list_item" onclick="getTherapy(this,loadProfile)" data-index="'+i+'"><label class="text-center">'+DataArray[i].Name+'</label><label class="text-center">'+DataArray[i]['Full Address']+'</label></div>';
	}
	$("#therapy_list").append(div);
}

function updateDetailSlider(){
	//console.log('map moved');
	$detailslider.children(".slick-list").children(".slick-track").empty();
	maplayer.eachLayer(function(layer){
		if(layer instanceof L.Marker){
			if($map.getBounds().contains(layer.getLatLng())){
				var div = createItem(layer);	
				$detailslider.slick('slickAdd',div);	
			}
		}
	});
	$detailslider.on('swipe', function(e){
		var currentindex = parseInt($detailslider.children('.slick-list').children('.slick-track').children('.slick-current').attr('data-slick-index'));
		//$map.panTo(markers_array[currentindex].getLatLng(),{animate: true, duration: 0.5});
		markersinview_array[currentindex].openPopup();
	});
	$detailslider.slick('refresh');	
}

function createItem(layer){
	var div='<div data-index="'+layer.options['index']+'" onclick="getTherapy(this,loadProfile)"><label>'+ layer.options['name']+'</label><label>'+ layer.options['address']+'</label></div>';
	console.log(div);
	return div;
}

function initialDetailSlider(){
	$detailslider.slick({
        arrows: false,
        infinite: false,
        dots: false,
        speed: 150
    });

	$detailslider.on('swipe', function(e){
		//var currentindex = $detailslider.slick('slickCurrentSlide');
		var currentindex = parseInt($detailslider.children('.slick-list').children('.slick-track').children('.slick-current').attr('data-index'));
		console.log(currentindex);
		//console.log(currentindex);
		//$map.panTo(markers_array[currentindex].getLatLng(),{animate: true, duration: 0.5});
		markers_array[currentindex].openPopup();
	});

	$detailslider.on('swipedown', function(){
		if($cateslider.is(":hidden") && $detailslider.is(":visible") ){
			$cateslider.slideToggle(200);
			$detailslider.slideToggle(150);

		}
		else{
			return;
		}
	})
}

function initialCateSlider(){
	$cateslider.slick({
        arrows: false,
        infinite:false,
        dots: false,
        speed: 150
    });
    $cateslider.on('afterChange',function(e){
        if(typeof(maplayer) == 'undefined'){
            return;
        }
        else{
            switchCategory(addLayer);
        }
    });
 	$cateslider.on('click',function(e){
 		$(".filter-wrap").toggleClass('toggle');
 	});
}

function updateLayer(){
	console.log("start update layer");
	
	var currentType= maplayer.type;
	$map.removeLayer(maplayer);
	markersinview_array = [];
	//therapy_array = getDataAray(type);
	//callback(therapy_array);
	for(var i = 0,len=therapy_array.length; i< len;i++){
		var latlng = L.latLng(therapy_array[i].Latitude, therapy_array[i].Longitude);
		if($map.getBounds().pad(-0.1).contains(latlng)){
			var marker = new WSMarker(latlng,
			{
				icon:myIcon,
				index: i, 
				name:therapy_array[i].Name,
				address:therapy_array[i]['Full Address']
			}).bindPopup(therapy_array[i].Name,{autoPan:false})
			  .on('click',clickOnMarker);
			marker.sliderIndex = i;
			markersinview_array.push(marker);
		}
	}
	maplayer = L.layerGroup(markersinview_array);
	maplayer.type=currentType;
	maplayer.addTo($map);
	updateDetailSlider();
	endLoading();

}