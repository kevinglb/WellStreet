/* global variables and general functions */
/* clarify DOM targets through ID or class name to aovid using ID or Class name in other functions as much as we can */
var $map;
var $detailslider = $("#detail_slider");
var $cateslider = $("#category_slider");

var maplayer;/*layer stores all markers*/
var markersInView_array=[]; /*stores all current visible markers on the map*/
var therapy_array = [];/*array stores all therapies under selected categery*/
var currentTherapy;
var category_array = [{'Name': 'acupuncturist'},{'Name': 'allergy'},{'Name': 'aromatherapist'},{'Name': 'ciropodist'},{'Name': 'chiropractor'}]; //array stors all categories in order
var myIcon = L.icon({iconUrl: 'icon/location-dark.svg',iconRetinaUrl: 'icon/location-dark.svg',iconSize: [30, 30],draggable:true});//icon setting
var CurrentLocation = [];/*array stores geographical info: latitude and longitude*/
var CurrentLocation_array = [];
//var CurrentLocationLayer;/*layer stores current location marker*/

//api_key
var api_key = "";
var categery_url = "https://wellstreet.co/api/list/categories";
//Returns a json array of categories. Each category has two elements:
// id: The system id for the category
// name: The user-friendly string name of the category
var searcharound_url = "https://wellstreet.co/api/search/map"; 
//Finds the services within a given distance from a latitude,longitude point.
// parameters:
// key    -    The API token for the user (required)
// lat    -    The latitude of the user's coordinates (required)
// lng    -    The longitude of the user's coordinates (required)
// distance -    The distance in kilometers to search within (default is 2)
// category - The category id of the service category to search for.

/*clear markers and tilelayers on the map*/ 

function emailRegisterOnFocus(){
	//$(this).preventDefault()
	//$(".social_login_wrap").slideToggle(300);
	$("#register_password").fadeIn(100);
	$("#register_sub").fadeIn(100);
	
	return	false;
}
function searchFocused(){
	//resetMapSearch();
	//detect whether the history list is visible in case that user focus(click) on the search input when searching
	if($("#search_history_list").is(":visible")){
		return;
	}
	else{
		$("#search_history_list").slideToggle(200);
    	$(".overlay").toggle();
    	// $(".arrow_wrap a").toggle();
    	//$(".search_wrap").addClass('appear');
	}
    $('#search_history_list').unbind('click').on('click','li', function(){
     	resetMapSearch();
     	// $(".search_wrap").removeClass('appear');
    })
}


function resetMapSearch(){
	//$(".search_wrap").removeClass('appear');
	/* hide search history list and blur the input*/
	if($("#search_history_list").is(":visible")){
		$("#search_history_list").slideToggle(200);
        $("#search_input").blur();
	}
	// hide timepicker_wrap and show button
	// if($("#timepicker_wrap").is(":visible")){
	// 	$("#timepicker_wrap").slideToggle(200);
	// }
	// if($(".arrow_wrap a").is(':hidden')){
	// 	$(".arrow_wrap a").toggle();
	// }
	// hide the overlay
	if($('.overlay').is(":visible")){
		console.log("overlay is visible");
		$('.overlay').toggle();
	}
}

function resetMapPage(){
	/*clear mapslide and re-initial*/
	removeAllMarkers();
	console.time("resetMapPage");
	// if($(".map-wrap").hasClass("toggle") || $(".list-wrap").hasClass("toggle")){
	// 	toggleContent();
	// }

	//empty the list
	$("#therapy_list").empty();
	// console.log("therapy_list is emptyed");
	//$detailslider.children(".slick-list").children(".slick-track").empty();
	
	if($cateslider.is(":hidden")){
		$cateslider.slideToggle(200);
	}
    
	
	console.timeEnd("resetMapPage");
}

function removeAllMarkers(){
	$map.removeLayer(maplayer);
	therapy_array = [];
	markersInView_array = [];
}

/*for back button*/
function slideBack(target_page,callback){
	console.time('slideback');
	$.mobile.changePage("#"+target_page, 
    {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    
    if(typeof(callback) == "function"){
    	callback();
    }
    console.timeEnd('slideback');
    // return false;
}


/*for buttons that jumps to another page besides back button*/
function changePage(target_page, transition,callback){
	console.time('changePage');
	$.mobile.changePage("#"+target_page, 
    {
        transition: transition,
    });
	if(typeof(callback) == "function"){
    	callback();
    }
    console.timeEnd('changePage');
    // return false;
    
}

function toggleContent(element){
	// if($(".filter-wrap").hasClass("toggle")){
	// 	$(".filter-wrap").toggleClass('toggle');
	// }
	$(".map-wrap").toggleClass('toggle');
	$(".list-wrap").toggleClass('toggle');
	$(element).children("i").toggleClass("hidden");
	if(!$('.category-wrap').hasClass('slider-appear')){
		console.log('no slider appear');
		$('.category-wrap').toggleClass('slider-appear');
	}
	//$(".filter-wrap").toggleClass('right');
}

