L.WSMarker = L.Marker.extend({
	options:{
		address: 'custom address',
		type: 'custom address'
	},

	initialize : function(latlng,options){
		L.Marker.prototype.initialize.call(this, latlng);
		this._address = '' || options.address;
		this._type = '' || options.type;
		
		//tag might be an array
		//this._tag = tag;
	},

	setAddress: function(address){
		this._address = '' || address;
	},

	getAddress: function(){
		return this._address;
	},

	setType: function(type){
		this._type = '' || type;
	},

	getType: function(){
		return this._type;
	}



});

L.WSMarker = function (latlng,options) {
  return new L.WSMarker(latlng, options);
};