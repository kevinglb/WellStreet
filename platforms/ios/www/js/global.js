/* global variables and general functions */
var map;
//checks to see if the "touchend" event is supported in the browser and if not then we use the "click" event.    
var clickOrTouch = (('ontouchend' in window)) ? 'touchend' : 'click';

/*clear markers and tilelayers on the map*/ 
function clearMap(){

}

function searchFocused(){
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
     	
     	$("#search_input").blur();
     	$(".overlay").toggle();
     	$(".arrow_wrap a").toggle();
     	$("#search_history_list").slideToggle(200);
     })
}