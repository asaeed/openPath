var OpenPath = window.OpenPath || {};

OpenPath.user = {
	init : function(){
		console.log('openPath.user.init');
		this._id = null;
	},
	onMenuChange : function(){
		console.log('on menu change');
		if( $('#profile').hasClass('active') ){
			this.profile.init();
		}
		if( $('#settings').hasClass('active') ){
			this.settings.init();
		}
	},
	getByEmail : function( callback ){
		var self = this;
		console.log('getting : '+email);
		//TODO: FIX go through session
	
		$.ajax({
			url: '/users-email/'+email,
			type:'GET',
			success: function(data) { 
				console.log('user got');
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
				data: {$set:d},
				dataType:'json',
				type:'PUT',
				async:false,
				success: function(new_data) { 
					console.log('user updated',new_data.$set);
					callback(new_data.$set );
				},
				error: function(msg){
					console.log('user not updated',msg);
				}
			});
	},
	updateXX : function( d, callback){
		var self = this;
		
		console.log(d)
		//console.log(self._data)
		
		//TODO: loop through self._data and see if prop has prop update it else save it to same
		//then update all with saved and new props using update
		//new note: bad idea cus saving on front end could erase
		
		//??
		
		/*
		return;
		//called with every property and it's value
		function sendObj(key,value){
			console.log(key + " : "+value);
			
			var nextIs = false;
			if(typeof value === 'object'){
				nextIs = true;
			}
			console.log('next is ',nextIs)
			
		}
		
		function traverseObject(obj){
			for(key in obj){
				sendObj(key,obj[key]);
				if(typeof obj[key] === 'object'){
					//console.log('recursive',obj[key])
					traverseObject(obj[key]);
				}
			}
		}
		//traverseObject(d);
		
		for(var key in d){
			console.log(key);
			console.log(JSON.stringify( d[key] ));
			console.log(key + " : "+d[key]);
			if(typeof d[key] === 'object'){
				console.log('recursive',obj[key])
				//replaceItem( key, d[key], d ); //old update
			}else{
				updateItemData( key, d[key] , d );
			}
		}
		
		function updateItemData( key, value, d ){
			$.ajax({
				url: '/users/'+self._id,//TODO: security?
				//url : '/update/users/'+self._id+'/'+key+'/'+value,
				data: d,
				dataType:'json',
				type:'PUT',
				async:false,
				success: function(data) { 
					console.log('user updated',data);
					callback( data );
				},
				error: function(data){
					console.log('user not updated');
				}
			});
		}

*/

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
