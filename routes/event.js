
var mongo = require('mongodb');
var http = require('http');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
db = new Db('openpathdb', server, {safe: true});
//db = new Db('openpathdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'openpathdb' database");

        db.collection('events', function(err, collection){
            collection.findOne(function(err, item) {
                if (!item){
                    populateDB();
                }
            });
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving item: ' + id);
    db.collection('events', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('events', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addItem = function(req, res) {
    var item = req.body;
    console.log('Adding item: ' + JSON.stringify(item));
    db.collection('events', function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                res.send({'_id': "", 'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                //res.send(result[0]);
                res.send({'_id': result[0]._id, 'error': ""});
            }
        });
    });
}

exports.updateItem = function(req, res) {
    var id = req.params.id;
    var newItem = req.body;
    console.log('Updating item: ' + id);
    console.log(JSON.stringify(newItem));
    db.collection('events', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, newItem, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating item: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(newItem);
            }
        });
    });
}

exports.deleteItem = function(req, res) {
    var id = req.params.id;
    console.log('Deleting item: ' + id);
    db.collection('events', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once
var populateDB = function() {

    var events = [
	  {
	  //_id:  [this is created when saved into mongodb]
	  "creator": "jaredlamenzo@gmail.com",
	  "name": "Invention and the Patent Model",
	  "description": "Between the years 1790 and 1880 the U.S. Patent Office required both documentation and a three-dimensional working model to demonstrate each new invention submitted for a patent. The models helped to explain proposed innovations and compare them against similar inventions. They reflect the interests and the needs of the period, along with the division of labor between men and women.",
	  "location": [38.891313, -77.029999],    // to match with users in the area
	  "locationDescription": "National Museum of American History",    // to display with event info, might want to add address though google maps may have built into API?
	  "link": "http://americanhistory.si.edu/exhibitions/invention-and-patent-model", //allow them to enter link
	  "startTime": "7/1/2013 10:00:00",
	  "endTime": "7/1/2013 10:30:00",
	  "grades": ["9-12"],
	  "interests": ["technology", "history of technology", "early American history", "innovation", "high school"]
	  //HasPresenter: false,  if they have a presenter, they can start multiple sessions in view-only mode
	                          // event creators would have this ability for their created event; 
	                          // not implemented until we implement MCU  InvitedUsers: ["sam@email.com", "jill@email.com", "greg@email.com"],
	  //Sessions: [10001, 10004, 10005]  these are for multiple streaming sessions  
	},
	{
	  //_id:  [this is created when saved into mongodb]
	  "creator": "ilonaparkansky@gmail.com",
	  "name": "Learning Labs Pop-Up",
	  "description": "The Maker Space @ NYSCI is super excited to be streaming our third Learning Labs Pop-Up on Saturday, July 6th. A social environment with fun, engaging, youth driven activities! Check out the Maker Space blog to see what we have been up to, and tune in at 3PM for presentations of student projects. http://makerspace.nysci.org/  MOZILLA WEB MAKER: Make AWESOME stuff on the web. Build your own webpage. Pick up some coding skills (HTML & CSS). Remix a youtube video. Create a meme....Become a Webmaker! (https://webmaker.org/en-US/).  ",
	  "location": [40.778740, -73.869844],    // to match with users in the area
	  "locationDescription": "Maker Space at New York Hall of Science",    // to display with event info, might want to add address though google maps may have built into API?
	  "link": "http://learninglabspopup.eventbrite.com/", //allow them to enter link
	  "startTime": "7/6/2013 15:00:00",
	  "endTime": "7/6/2013 16:00:00",
	  "grades": ["9-12"],
	  "interests": ["technology", "maker", "presentations", "Web", "high school"],
	  //HasPresenter: false,  if they have a presenter, they can start multiple sessions in view-only mode
	                          // event creators would have this ability for their created event; 
	                          // not implemented until we implement MCU  InvitedUsers: ["sam@email.com", "jill@email.com", "greg@email.com"],
	  // Sessions: [10001, 10004, 10005]  these are for multiple streaming sessions
	},
	{
	    //_id:  [this is created when saved into mongodb]
	  "creator": "richardscullin@gmail.com",
	  "name": "Van Eyck, Bruegel, and the Natural World",
	  "description": "A guided tour exploring how Netherlandish artists working during the fifteenth and sixteenth centuries conveyed spiritual and secular ideas through depictions of nature. Then, discover how landscape painting emerged as a subject of art as you study Pieter Bruegel's masterpiece The Harvesters up close in the galleries.",
	  "location": [40.779012, -73.962383],    // to match with users in the area
	  "locationDescription": "Metropolitan Museum of Art",    // to display with event info, might want to add address though google maps may have built into API?
	  "link": "http://www.metmuseum.org/events/programs/workshops-and-courses/short-courses/northern-european-paintings?eid=A003_%7b2F2A4223-CB79-437D-AE97-CA3EC2BBA493%7d_20130322155027", //allow them to enter link
	  "startTime": "7/20/2013 14:00:00",
	  "endTime": "7/20/2013 15:00:00",
	  "grades": ["9-12", "postsecondary", "lifelong"],
	  "interests": ["history of art", "Netherlandish", "Fifteenth century", "Sixteenth Century", "European masters", "nature", "landscape painting", "art history"],
	  //HasPresenter: false,  if they have a presenter, they can start multiple sessions in view-only mode
	                          // event creators would have this ability for their created event; 
	                          // not implemented until we implement MCU  InvitedUsers: ["sam@email.com", "jill@email.com", "greg@email.com"],
	  // Sessions: [10001, 10004, 10005]  these are for multiple streaming sessions
	},
	{
	   //_id:  [this is created when saved into mongodb]
	  "creator": "richard@mobileed.org",
	  "name": "Diego Rivera Mural at the Stock Exchange Tower ",
	  "description": "The mural Allegory of California graces the stairwell of the City Club (Formerly the Pacific Stock Exchange Club). Normally closed the public, this is an opportunity to see the first mural painted in the US by the great Mexican artist Diego Rivera. The Pacific Stock Exchange Lunch Club, now the City Club, is considered the best interior in the Art Deco style in San Francisco, and among the best in California.",
	  "location": [37.791679, -122.400792],    // to match with users in the area
	  "locationDescription": "Stick Exchange Tower",    // to display with event info, might want to add address though google maps may have built into API?
	  "link": "http://www.sfcityguides.org/Reservations/descx.php?tour=96", //allow them to enter link
	  "startTime": "7/14/2013 12:00:00",
	  "endTime": "7/20/2013 13:00:00",
	  "grades": ["6-8", "9-12", "postsecondary", "lifelong"],
	  "interests": ["history of art", "architecture", "California history", "mural painting", "Mexican artists"],
	  //HasPresenter: false,  if they have a presenter, they can start multiple sessions in view-only mode
	                          // event creators would have this ability for their created event; 
	                          // not implemented until we implement MCU  InvitedUsers: ["sam@email.com", "jill@email.com", "greg@email.com"],
	  // Sessions: [10001, 10004, 10005]  these are for multiple streaming sessions
	}
	];

    db.collection('events', function(err, collection) {
        collection.insert(events, {safe:true}, function(err, result) {});
    });

};