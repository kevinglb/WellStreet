// var L.NumberedDivIcon = L.Class.extend({
// 	options: {
//     iconUrl: 'icon/location-dark.svg',
//     number: '',
//     shadowUrl: null,
//     iconSize: (30, 30),
// 	iconAnchor: (13, 41),
// 	popupAnchor: (0, -33),
// 	className: 'leaflet-div-icon'
// 	},
//  	initialize: function(){
//  		L.setOption(this, options);

//  	}
// 	createIcon: function () {
// 		var div = document.createElement('div');
// 		var img = this._createImg(this.options['iconUrl']);
// 		var numdiv = document.createElement('div');
// 		numdiv.setAttribute ( "class", "number" );
// 		numdiv.innerHTML = this.options['number'] || '';
// 		div.appendChild ( img );
// 		div.appendChild ( numdiv );
// 		this._setIconStyles(div, 'icon');
// 		return div;
// 	},
 
// 	//you could change this to add a shadow like in the normal marker if you really wanted
// 	createShadow: function () {
// 		return null;
// 	}
// });

// L.WSDivIcon = L.DivIcon.extend({
// 	options: {
// 		className: 'my-divIcon',
// 		iconSize: [100,20],
// 		html: ''

// 	},
// 	createIcon: function () {
//         var div = L.DivIcon.prototype.createIcon.call(this),
//             options = this.options;

//         if (options.html) {
//                 div.innerHTML = this._createInner();
//             }
//             return div;
//         },
// });

WSDivIcon = L.DivIcon.extend({
    options:{
        className: 'my-divIcon',
        iconSize: [60,30],
        html: '',

    },
    createIcon: function() {
    var div = L.DivIcon.prototype.createIcon.call(this),
        options = this.options;
        if (options.html) {
            div.innerHTML = options.html;
        }
        return div;
    },
    // setContent: function(html){
    //     this.options.html = html;
    //     this.html(html);
    // }
});

