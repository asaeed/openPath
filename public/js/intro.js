'use strict';

var OpenPath = window.OpenPath || {};


OpenPath = {
	/**
	 * intro page toggle signup, login, callout...
	 */
	intro : function(){
		var toggles = document.getElementsByClassName('toggle'),
			signupBtn = document.getElementById('signupBtn'),
			loginBtn = document.getElementById('loginBtn');

		function toggle( className ){
			for(var i=0;i<toggles.length;i++){
				if(toggles[i].classList.contains(className)){
					toggles[i].style.display = 'block';
				}else{
					toggles[i].style.display = 'none';
				}
				
			}
		}
		//events
		loginBtn.addEventListener('click',function(){
			toggle('login');
		},false);
		signupBtn.addEventListener('click',function(){
			toggle('signup');
		},false);
	}
};

window.onload = function(){
	OpenPath.Ui.convertEventTimeInTitle();
	OpenPath.intro();
};