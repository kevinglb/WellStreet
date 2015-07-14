/* a plug-in script that smashes the delay on click event */
(function( $ ) {
	$.fn.noClickDelay = function() {
		var $wrapper = this;
		var $target = this;
		var startPoint = null;
		var moveDistance;
		var moved = false;	
		var distance = 15;
		var touch = null;
		$wrapper.bind('touchstart mousedown',function(e) {
			e.preventDefault();
			touch = e.originalEvent.touches[0];
			moveDistance = 0;
			moved = false;
			$target = $(e.target);
			if($target.nodeType == 3) {
				$target = $($target.parent());
			}
			startPoint = { x: touch.screenX, y: touch.screenY };
			//$target.addClass('pressed');
			$wrapper.bind('touchmove mousemove',function(e) {
				touch = e.originalEvent.touches[0];
				moveDistance = Math.sqrt(Math.pow(touch.screenX - startPoint.x, 2) +
                                   Math.pow(touch.screenY - startPoint.y, 2));
				if (moveDistance > distance) {
					moved = true;
				}
				//$target.removeClass('pressed');
			});
			$wrapper.bind('touchend mouseup',function(e) {
				$wrapper.unbind('mousemove touchmove');
				$wrapper.unbind('mouseup touchend');
				if(!moved && $target.length) {
					//$target.removeClass('pressed');
					$target.trigger('click');
					$target.focus();
				}
			});
		});
	};
})( jQuery );
