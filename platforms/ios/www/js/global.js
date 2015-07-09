/* global variables and general functions */
/* clarify DOM targets through ID or class name to aovid using ID or Class name in other functions as much as we can */
var $map;
var $mapslider = $("#detail_slider");

var maplayer;/*layer stores all markers*/
var markers_array=[];/*array stores all markers*/
var therapy_array = [];/*array stores all therapies under selected categery*/

var myIcon = L.icon({iconUrl: 'icon/location-dark.svg',iconRetinaUrl: 'icon/location-dark.svg',iconSize: [30, 30],});//icon setting
var CurrentLocation = [];/*array stores geographical info: latitude and longitude*/
var CurrentLocation_array = [];
var CurrentLocationLayer;/*layer stores current location marker*/

/*clear markers and tilelayers on the map*/ 


function searchFocused(){
	resetMapSearch();
	//detect whether the history list is visible in case that user focus(click) on the search input when searching
	if($("#search_history_list").is(":visible")){
		return;
	}
	else{
		$("#search_history_list").slideToggle(200);
    	$(".overlay").toggle();
    	$(".arrow_wrap a").toggle();
	}
    $('#search_history_list').unbind('click').on('click','li', function(){
     	resetMapSearch();
    })
}


function resetMapSearch(){
	/* hide search history list and blur the input*/
	if($("#search_history_list").is(":visible")){
		$("#search_history_list").slideToggle(200);
        $("#search_input").blur();
	}
	// hide timepicker_wrap and show button
	if($("#timepicker_wrap").is(":visible")){
		$("#timepicker_wrap").slideToggle(200);
	}
	if($(".arrow_wrap a").is(':hidden')){
		$(".arrow_wrap a").toggle();
	}
	// hide the overlay
	if($('.overlay').is(":visible")){
		console.log("overlay is visible");
		$('.overlay').toggle();
	}
}

function resetMapPage(){
	
	$mapslider.empty();
	$mapslider.removeClass("slick-initialized slick-slider");
	if($mapslider.is(":hidden")){
		$mapslider.slideToggle(200);
	}
 	$mapslider.slick({
        arrows: false,
        infinite: false,
        dots: false
    }); 
    $map.setView([53.3478, -6.2579], 12);
    //$mapslider.slideToggle();
	removeAllMarkers();
}

function removeAllMarkers(){
	$map.removeLayer(maplayer);
	markers_array = [];
	therapy_array = [];
}