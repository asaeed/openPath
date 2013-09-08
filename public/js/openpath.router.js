OpenPath = window.OpenPath || {};

OpenPath.Router = Backbone.Router.extend({
    routes: {
        "*actions": "defaultRoute" // matches http://example.com/#anything-here
    }
});
// Initiate the router
var app_router = new OpenPath.Router;

app_router.on('route:defaultRoute', function(actions) {
    alert(actions);
})

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();