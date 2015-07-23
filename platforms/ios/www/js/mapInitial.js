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
    if(!$detailslider.hasClass('slick-initialized')){
    	    initialDetailSlider();
    }
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
            
			callback(type, updateDetailSlider);	
			console.timeEnd('cateslider');
		}
		else{
			endLoading();
			alert("failed in loading data");	
		}
    });
}

function endLoading(){
	$.mobile.loading('hide');
	$(".loading_wrap").fadeOut(150);
}

/*function for adding new layer on the map or change layer of another category*/
function addLayer(type,callback){
	therapy_array = getDataAray(type);
	//add content to the list
	addList(therapy_array);
	var currentBounds = $map.getBounds().pad(-0.1);
	
	for(var i = 0,len=therapy_array.length; i< len;i++){
		var DivIcon =new WSDivIcon({html: i});
		var latlng = L.latLng(therapy_array[i].Latitude, therapy_array[i].Longitude);
		if(currentBounds.contains(latlng)){
			var marker = new WSMarker(latlng,
			{
				icon:DivIcon,
				index: i, 
				name:therapy_array[i].Name,
				address:therapy_array[i]['Full Address']
			}).on('click',clickOnMarker);
			
			markersInView_array.push(marker);
		}
	}

	maplayer = L.layerGroup(markersInView_array);
	maplayer.type=type;
	maplayer.addTo($map);
	endLoading();
		
	if($detailslider.is(':visible')){
		//$detailslider.slideToggle(200, endLoading);
	}
	else{
		endLoading();
	}
	getUserCurrentLocation();
	callback(markersInView_array);
}

//update the layer when the map view is changed
function updateLayer(callback){
	var currentType = maplayer.type;
	$map.removeLayer(maplayer);
	markersInView_array = [];

	var currentBounds = $map.getBounds().pad(-0.1);
	for(var i = 0,len=therapy_array.length; i< len;i++){
		var DivIcon =new WSDivIcon({html: i});
		var latlng = L.latLng(therapy_array[i].Latitude, therapy_array[i].Longitude);
		if(currentBounds.contains(latlng)){
			var marker = new WSMarker(latlng,
			{
				icon:DivIcon,
				index: i, 
				name:therapy_array[i].Name,
				address:therapy_array[i]['Full Address']
			}).on('click',clickOnMarker);
			markersInView_array.push(marker);
		}
	}

	maplayer = L.layerGroup(markersInView_array);
	maplayer.type=currentType;
	maplayer.addTo($map);
	
	updateDetailSlider(markersInView_array);
	
	if(typeof(callback) == 'function'){
		callback();
	}
	
}
//add brief info of selected marker into $detailslider
function clickOnMarker(e){	
	toggleSliders();

	for(var i=0, len = markersInView_array.length;i < len;i++){
		if($(markersInView_array[i]._icon).hasClass('active')){
			$(markersInView_array[i]._icon).removeClass('active')
		}
	}
	$(e.target._icon).toggleClass('active');

	$detailslider.children('.slick-list').children('.slick-track').children('.slick-slide').each(function(){
		if($(this).attr('data-index') == e.target.options.index){
			var index = $(this).attr("data-slick-index");
			$detailslider.slick('slickGoTo',parseInt(index));
		}
	});
}

/*detect whether the slider is visible when click on any marker on the map*/
function toggleSliders(){
	if($cateslider.is(":visible") ){
		$(".filter-wrap").removeClass('toggle slider-appear');
		$(".detail-wrap").removeClass('toggle').addClass('slider-appear');
		//$detailslider.slideToggle(200);
		//updateDetailSlider();
	}
	else{
		return;
	}
}

function getUserCurrentLocation()
{
	if(CurrentLocation.length !=0)
	{
		//var currentIcon = L.divIcon({className: 'my-divIcon', html:"You are here",iconSize:[100,0] });
		var currentIcon =new  WSDivIcon({className: 'current-location-icon',iconSize:[32,32],html: ''});
		/*detect whether currentlocation marker exists before adding if exists panto the marker, if not adding and panto*/
		if(CurrentLocation_array.length == 0){
			var CurrentLocationMarker = L.marker(CurrentLocation,{icon: currentIcon});//.bindPopup('You Are Here',{autoPan:false});
			CurrentLocation_array.push(CurrentLocationMarker);
			CurrentLocationLayer = L.layerGroup(CurrentLocation_array).addTo($map);
		}
		else{
			console.log('CurrentLocation marker exists');
		}
		$map.panTo(CurrentLocation_array[0].getLatLng(), {animate: true, duration: 0.5});
		//setTimeout(function(){CurrentLocation_array[0].openPopup();},300);
    }	
    else{
    	alert("Sorry, can't get your location now.");
    }
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
	changePage("therapy_profile_page", "slide");	
}

//load info of the selected therapy
function loadProfile(therapy){
	var innerhtml  = "";
	$("#therapy_profile_page .ui-header .therapy_county").text(therapy['County/State']+'.'+therapy.Country);
	$("#therapy_profile_page .ui-header .therapy_city").text(therapy.City);

	$("#therapy_profile_page .therapy_details .therapy_name").text(therapy.Name);
	$("#therapy_profile_page .therapy_details .therapy_address").text(therapy['Full Address']);	
	$("#therapy_profile_page .therapy_details .therapy_tel").text(therapy['Telephone Number']);	
	if(therapy['Rating']){
		$("#therapy_profile_page .therapy_details .therapy_rating").text("Rating: "+therapy['Rating']);	
	}
	if(therapy['Opening hours']){
		var openhour_array = therapy['Opening hours'].split(/\n/);
		for(i in openhour_array){
			innerhtml += openhour_array[i] + "<br />";	
		}
		$("#therapy_profile_page .therapy_details .therapy_openhour").html(innerhtml);
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
		console.log('map is cleaned');
		callback(nextType,updateDetailSlider);
	}
}

function addList(DataArray){
	var div='';
	for(var i = 0,len=DataArray.length; i< len;i++){
		div += '<div class="therapy_list_item" onclick="getTherapy(this,loadProfile)" data-index="'+i+'"><label class="text-center">'+DataArray[i].Name+'</label><label class="text-center">'+DataArray[i]['Full Address']+'</label></div>';
	}
	$("#therapy_list").append(div);
}
//update the detailslider content based on the markersInView_array
function updateDetailSlider(DataArray){
	//empty the detail slider first
	$detailslider.children(".slick-list").children(".slick-track").empty();

	for(var i = 0, len = DataArray.length; i < len;i ++){
		var div = createItem(DataArray[i]);	
		$detailslider.slick('slickAdd',div);	
	}
	$detailslider.on('swipe', function(e){

		var currentindex = parseInt($detailslider.children('.slick-list').children('.slick-track').children('.slick-current').attr('data-slick-index'));
		for(var i=0, len = markersInView_array.length;i < len;i++){
			if($(markersInView_array[i]._icon).hasClass('active')){
				$(markersInView_array[i]._icon).removeClass('active')
			}
		}
		$(markersInView_array[currentindex]._icon).addClass('active');
	});
	$detailslider.slick('refresh');	
}
//return a div including the brief info of the marker
function createItem(layer){
	//" onclick="getTherapy(this,loadProfile)"
	var div='<div data-index="'+layer.options['index']+'"><div class="col-xs-9"><label>'+ layer.options['name']+'</label><label>'+ layer.options['address']+'</label></div><div class="col-xs-3"><button class="wrap-trigger-btn detail-wrap-trigger" onclick="triggerBottomWrap(this);"></button><span>See More</span></div></div>';
	return div;
}
//initial the detailslider
function initialDetailSlider(){
	$detailslider.slick({
        arrows: false,
        infinite: false,
        dots: false,
        speed: 150
    });
	// $detailslider.on('swipe', function(e){
	// 	var currentindex = parseInt($detailslider.children('.slick-list').children('.slick-track').children('.slick-current').attr('data-index'));
	// 	//console.log(currentindex);
	// 	//console.log(currentindex);
	// 	//$map.panTo(markers_array[currentindex].getLatLng(),{animate: true, duration: 0.5});
	// 	markersInView_array[currentindex].openPopup();
	// });

	$detailslider.on('swipedown', function(){
		if($('.detail-wrap').hasClass("slider-appear")){
			//$cateslider.slideToggle(200);
			// $detailslider.slideToggle(150);
			$('.detail-wrap').removeClass('slider-appear');
			$('.filter-wrap').addClass('slider-appear');
			
		}
		else{
			return;
		}
	});

}

//initial the cateslider
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
 	// $cateslider.on('swipeup',function(e){
 	// 	$(".filter-wrap").toggleClass('toggle');
 	// 	$(".ui-header .back-btn").hide();
 	// 	$(".ui-header .list-btn").hide();
 	// 	$(".ui-header .cancel-btn").show();
 	// });
}

function addDivIcon(){
	var currentIcon =new WSDivIcon({html: '40 min'});
	var marker = L.marker(CurrentLocation,{icon: currentIcon}).addTo($map);

	marker.on('click', function(e){
		$(e.target._icon).toggleClass('active');
		//$(e.target._icon).html('the content is changed');
	})
}