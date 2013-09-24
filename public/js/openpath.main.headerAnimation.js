OpenPath = window.OpenPath || {};

OpenPath.main.headerAnimation = {
	init : function(){
		var self = this;
		this.header = $('header.main');
		this.headerShowing = true;
		this.overHeader = false;

		//over nav
		this.header.mouseover(function(){
        	self.overHeader = true;
        });
        this.header.mouseout(function(){
        	self.overHeader = false;
        });

        if($('.navHotSpot').length <= 0) return;  //if no place to re open header with, return

        $('.navHotSpot').mouseover(function(){
        	self.overHeader = true;
        	if(self.headerShowing === false) self.showNav();
        	
        });
        $('.navHotSpot').mouseout(function(){
        	self.overHeader = false;
        	setTimeout(function(){
				if(self.overHeader === false){
					self.hideNav();
				}
			}, 1000);
        });
        
        //hide on init
        setTimeout(function(){
			if(self.overHeader === false){
				self.hideNav();
			}
		}, 1000);
	},
	showNav : function(){
		var self = this;
		$('header.main').animate({ top: 0 },500,function(){
			self.headerShowing = true;
		});
	},
	hideNav : function(){
		var self = this;
		$('header.main').animate({ top: -$('header.main').height() },1000,function(){
			self.headerShowing = false;
		});
	}

};