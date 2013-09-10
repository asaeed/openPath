OpenPath = window.OpenPath || {};

OpenPath.EventModel = Backbone.Model.extend({
	//urlRoot: '/events',
  defaults: {
    name: '',
    creator: '',
    description: '',
    location:[40.7142, -74.0064],//lat , lng
    locationDescription : '',
    grades:[],
    startTime:'',
    endTime:''
  },
  validate: function( attributes ){
    if( attributes.name == '' ){
        return "You need to name the event";
    }
    //TODO: more validation, st > et etc
  },
  initialize: function(){
    console.log("new Event initialized");
    this.bind("error", function(model, error){
        // We have received an error, log it, alert it or forget it :)
        alert( error );
    });
  }
});

/**

'name': name,
'creator': creator,
'description': description,
'location': [self.lat, self.lng], 
'grade': gradelevels,
'startTime': startTime,
'endTime': endTime,
'grades': gradelevels



Events: {
  _id: 1234567890
  Creator: "jared@email.com",
  Name: "AMNH Dinosaurs Tour",
  Description: "Follow one of our staff on a guided tour of the dinosaurs exhibit!",
  Location: [lat, long],    // to match with users in the area
  LocationDescription: "AMHN",    // to display with event info
  StartTime: "3/18/2013 17:00:00",
  EndTime: "3/18/2013 19:00:00",
  Grades: ["PreK-2", "3-5", "6-8"],
  Interests: ["archaeology", "museums"],
  HasPresenter: false,    // if they have a presenter, they can start multiple sessions in view-only mode
                                   // event creators would have this ability for their created event.
  InvitedUsers: ["sam@email.com", "jill@email.com", "greg@email.com"],
  Sessions: [10001, 10004, 10005]    //  
}
*/