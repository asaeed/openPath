var OpenPath = window.OpenPath || {};

/**
 * object that handles updates to user profile
 */
OpenPath.user.profile = {
	init : function(){
		//TODO: validate
		var self = this;
		//dom eles
		this.profileWrapper = $('#profile');
		this.profileUsername = $('h1#profileUsername');
		this.form = this.profileWrapper.find('form');
		this.displayView = this.profileWrapper.find('.displayView');
		this.editView = this.profileWrapper.find('.editView');
		this.editProfileBtn = this.profileWrapper.find('a.editProfileBtn');
		
		//actions
		OpenPath.user.getByEmail(function(d){
			self.populate(d);
		});
		
		
		this.editProfileBtn.click(function(){
			self.showEditView();
		});
		
		
		this.form.submit(function(e){
			//console.log('update profile',username,email,sessionID);
			var firstName = $(this).find('.firstName').val(),
				lastName = $(this).find('.lastName').val(),
				gradelevel = $(this).find('.gradelevel').val(),
				interests = $(this).find('.interests').val(),
				colearners = $(this).find('.colearners').val(),
				data = {
					//'Email':email,
					'Name': {'First' : firstName, 'Last' : lastName},
					'Grade': gradelevel,
					'Interests': interests.split(',').join(', ')//,TODO : too many spaces, fix split join
					//'HomeLocation': [lat, long],
					//'Locations': [],
					//'EventsInvitedTo': [],
					//'SessionsInvitedTo': [],
					//'EventsCreated': [],
					//'SessionsCreated': []
				}
			
			
			OpenPath.user.update(data, function(d){
				self.populate(d);
				//dom hide/show change on success
				self.showDisplayView();
			});
			
			
			return false;
		});
		
	},
	showDisplayView : function(){
		this.editView.hide();
		this.profileUsername.show();
		this.displayView.show();
	},
	showEditView : function(){
		this.profileUsername.hide();
		this.displayView.hide();
		this.editView.show();
	},
	populate : function( data ){
		console.log('populate',data.email,data._id);
		
		var noData = true;
		
		if(data.Name && data.Name !== ' '){
			$('#profileUsername').html(data.Name.First +' '+data.Name.Last);
			
			this.profileWrapper.find('form .firstName').val(data.Name.First);
			this.profileWrapper.find('form .lastName').val(data.Name.Last);
			
			noData = false;
		}else{
			console.log('no name');
		}
		
		if(data.Grade){
			this.profileWrapper.find('.displayView article.gradelevel .results').html(data.Grade);
			//populate select ele with correct option selected
			this.profileWrapper.find("form select.gradelevel > option").each(function() {
				if(this.value === data.Grade){
					$(this).attr('selected','selected');
				}
			});
			
			noData = false;
		}else{
			console.log('no grade')
		}
		
		if(data.Interests){
			this.profileWrapper.find('.displayView article.interests .results').html(data.Interests);
			//TODO: pop select form with correct option
			this.profileWrapper.find('form .interests').val(data.Interests);
			
			noData = false;
		}else{
			console.log('no interests')
		}
		
		if(noData === true){
			this.showEditView();
		}
	}
};
