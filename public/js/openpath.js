OpenPath = {
	init : function(){

		//TODO: clean layout.html and add js to name space
		console.log(this) 
		
		//this = OpenPath		
		
		
		if(	$('#mainheader').length > -1 ){
			this.main.init();
		}
	}
};
