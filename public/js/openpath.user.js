var OpenPath = window.OpenPath || {};

OpenPath.user = {
	init : function(){
		//console.log('openPath.user.init');
		this._id = null;
	},
	onMenuChange : function(){
		//console.log('on menu change');
		if( $('#profile').hasClass('active') ){
			this.profile.init();
		}
		if( $('#settings').hasClass('active') ){
			this.settings.init();
		}
	},
	getByEmail : function( callback ){
		var self = this;
		//console.log('getting : '+email);
		//TODO: FIX go through session or check auth
	
		$.ajax({
			url: '/users-email/'+email,
			type:'GET',
			success: function(data) { 
				//console.log('user got');
				self._data = data;
				self._id = data._id;
				callback(data);
			},
			error: function(data){
				console.log('user not got');
			}
		});
	},
	update : function( d, callback){
		var self = this;
		$.ajax({
				url: '/users/'+self._id,//TODO: security?
				//url : '/update/users/'+self._id+'/'+key+'/'+value,
				data: {$set:d}, /*{$set writes to individual keys rather than overriding whole entry*/
				dataType:'json',
				type:'PUT',
				async:false,
				success: function(new_data) { 
					//console.log('user updated',new_data.$set);
					callback(new_data.$set );
				},
				error: function(msg){
					console.log('user not updated',msg);
				}
			});
	}
};




/*old
	update : function(lat,long){
		$.ajax({
			url: '/users/51eab1c525780e336f00000b',
			data:{
				'name': "JaRasta",
				'grade': "6-8",
				'Interests': ["robotics", "coding", "archaeology"],
				'HomeLocation': [lat, long],
				'Locations': [],
				'EventsInvitedTo': [],
				'SessionsInvitedTo': [],
				'EventsCreated': [],
				'SessionsCreated': []	
			},
		    dataType:'json',
		    type:'PUT',
		    async:false,
			success: function(data) { 
				console.log('user updated');
		    },
		    error: function(data){
				console.log('user not updated');
			}
		});
	}
	*/
