OpenPath = window.OpenPath || {};

OpenPath.Router = Backbone.Router.extend({
    routes: {
        "*actions": "defaultRoute" // matches http://example.com/#anything-here
    }
});
// Initiate the router
var app_router = new OpenPath.Router;


app_router.on('route:defaultRoute', function(actions) {
    console.log('route:',actions);
    if(actions === 'main'){
    }
    if(actions === 'events'){
        var evCollection = new OpenPath.EventsView();
    

 /*
+        var evModel = new OpenPath.EventModel({
+                name: 'text event',
+                creator: 'ja',
+                description: 'lorem ip your butt',
+                location: [0, 0], 
+                grade: ['Pre-K to Grade 2'],
+                startTime: 0,
+                endTime: 0
+            });
+        var evView = new OpenPath.EventView({
+                model: evModel
+            });
+
+        $("#eventslist").html(evView.render().el);
+        */


    }

});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();