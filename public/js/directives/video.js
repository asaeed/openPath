"use strict";

App.directive('video', function () {
	return {
        restrict: 'A',
        scope: {
            video: '=' //this is a user object
        },
		templateUrl: "templates/_directives/video.html",
        link: function(scope, element, attrs ) {
            //scope.video is passed in in markup, it is a user obj
            
            console.log('vid dir',scope.video,scope.$parent.user);
           
            //dom vars
            var $video = element.find('video.video'),
                $usermeta = element.find('.usermeta'),
                $header =  $usermeta.find('header'),
                $closeBtn = $header.find('.closeBtn'),
                $mapBtn = $header.find('.mapBtn'),
                $mapWrap = $usermeta.find('.mapWrap'),
                $map = $mapWrap.find('.map');

            //set name
            scope.name;
            if(scope.video.firstName){
                scope.name = scope.video.firstName+ ' '+scope.video.lastName;
            }else{
                scope.video.email;
            }
            
            
            //this takes forever!!!!
            scope.$watch('video.location.coords.latitude',function(newValue,oldValue){
                console.log('location change',newValue,oldValue)

                if(newValue){
                    var $loc = scope.video.location.coords;
                    OpenPath.Ui.renderMap($map.get(0), $loc.latitude, $loc.longitude);
                }
            },true);


            //mute
            $video.attr('muted',false);//TODO : if presenter == true


            //events
            var self = this;
            var over = false;

            //bind events to video tag
            $video.bind('mouseover',function(e){
                over = true;
                $usermeta.css({opacity : 1});
            });
            $video.bind('mouseout',function(e){
                setTimeout(function(){
                    if(!over){
                        $usermeta.css({opacity : 0});
                    }
                },500);
                over = false;
            });
            /*
            this.video.addEventListener('click',function(e){
                //swap??
            },false);
            */
            //keep over as true if over meta
            $usermeta.bind('mouseover',function(e){
                over = true;
                $usermeta.css({opacity : 1})
            });
            $usermeta.bind('mouseout',function(e){
                setTimeout(function(){
                    if(!over){
                        $usermeta.css({opacity : 0});
                    }
                },500);
                over = false;
            });
            //click (for presenter)
            var on = false;
            $usermeta.bind('click',function(e){
                on = !on;
                if(on){
                    $usermeta.addClass('show');
                }else{
                    if($usermeta.hasClass('show')) $usermeta.removeClass('show');
                }
            });

            //mapBtn
            $mapBtn.bind('click',function(e){
                e.stopPropagation();
                $mapBtn.hide();
                $closeBtn.show();
                
                //check if we have location yet
                if(scope.video.location.coords.latitude !== null){
                    var $loc = scope.video.location.coords;
                    console.log(scope.video.location.coords.latitude)
                    OpenPath.Ui.renderMap($map.get(0), $loc.latitude, $loc.longitude);    
                }

                $mapWrap.show();
                $map.css({height : 200+'px'});
                $mapWrap.css({height : 200+'px'});
            });

            //closeBtn
            $closeBtn.bind('click',function(e){
                e.stopPropagation();
                $closeBtn.hide();
                $mapBtn.show();

                $mapWrap.hide();
            });
        }
	}
});