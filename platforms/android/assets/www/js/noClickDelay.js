/* a plug-in script that smashes the delay on click event */
(function( $ ) {
	$.fn.noClickDelay = function() {
		var $wrapper = this;
		var $target = this;
		var moved = false;	
		$wrapper.bind('touchstart mousedown',function(e) {
			e.preventDefault();
			moved = false;
			$target = $(e.target);
			if($target.nodeType == 3) {
				$target = $($target.parent());
			}
			$target.addClass('pressed');
			$wrapper.bind('touchmove mousemove',function(e) {
				moved = true;
				$target.removeClass('pressed');
			});
			$wrapper.bind('touchend mouseup',function(e) {
				$wrapper.unbind('mousemove touchmove');
				$wrapper.unbind('mouseup touchend');
				if(!moved && $target.length) {
					$target.removeClass('pressed');
					$target.trigger('click');
					$target.focus();
				}
			});
		});
	};
})( jQuery );

// function NoClickDelay(el) {
// 	this.element = typeof el == 'object' ? el : document.getElementById(el);
// 	if( window.Touch ) this.element.addEventListener('touchstart', this, false);
// }

// NoClickDelay.prototype = {
// 	handleEvent: function(e) {
// 		switch(e.type) {
// 			case 'touchstart': this.onTouchStart(e); break;
// 			case 'touchmove': this.onTouchMove(e); break;
// 			case 'touchend': this.onTouchEnd(e); break;
// 		}
// 	},

// 	onTouchStart: function(e) {
// 		e.preventDefault();
// 		this.moved = false;

// 		this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
// 		if(this.theTarget.nodeType == 3) this.theTarget = theTarget.parentNode;
// 		this.theTarget.className+= ' pressed';

// 		this.element.addEventListener('touchmove', this, false);
// 		this.element.addEventListener('touchend', this, false);
// 	},

// 	onTouchMove: function(e) {
// 		this.moved = true;
// 		this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
// 	},

// 	onTouchEnd: function(e) {
// 		this.element.removeEventListener('touchmove', this, false);
// 		this.element.removeEventListener('touchend', this, false);

// 		if( !this.moved && this.theTarget ) {
// 			this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
// 			var theEvent = document.createEvent('MouseEvents');
// 			theEvent.initEvent('click', true, true);
// 			this.theTarget.dispatchEvent(theEvent);
// 		}

// 		this.theTarget = undefined;
// 	}
// };
