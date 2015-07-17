//extend the marker class for adding customer options of the marker to achieve future operation
WSMarker = L.Marker.extend({
	options :{
		index: 0,
		name: 'name',
		address: 'full address'
	}
});
// 	initialize : function(latlng,options){
// 		L.Marker.prototype.initialize.call(this, latlng,options);
// 		L.Util.setOptions(this, options);
// 		//options = L.setOptions(this, options);
// 		// this._address = '' || options.address;
// 		// this._type = '' || options.type;
		
// 		//this._icon = L.Icon()
// 		//tag might be an array
// 		//this._tag = tag;
// 	},

// 	setAddress: function(address){
// 		this._address = '' || address;
// 	},

// 	getAddress: function(){
// 		return this._address;
// 	},

// 	setType: function(type){
// 		this._type = '' || type;
// 	},

// 	getType: function(){
// 		return this._type;
// 	}
// });

// 	L.WSMarker = function(latlng,options) {
//     	return new L.WSMarker(latlng, options);
// 	};


// var WSIcon = L.Icon.extend({
//     options: {
//     	iconRetinaUrl: 'icon/location-dark.svg',
//     	iconSize: [30, 30],
//     }
// });