OpenPath Implementation

We are working on peer branch of openpath currently, so this code will be deprecated in future builds.

=====================================================================================

Our first steps at connecting place-based learning. 
This is part of our development in rounds one and two of Mozilla Ignite.
http://openpathme.tumblr.com/

Our WebRTC videochat code is located here: 
http://github.com/vanevery/openpath/blob/master/README.md

part of Mozilla Ignite (mozillaignite.org)

Our pitch is here:

https://mozillaignite.org/apps/438/

Thanks!

====================================================================================
OpenPath's data model is divided into users, sessions, and events. 
We simplified the code recently so that sessions and events are treated similarly (see peer branch).

Be forewarned, this is a work in progress.

The service API's follow the standard "RESTful" setup. We are cleaning all of this up in the peer branch.


There are 2 ways to save any type of data be it an item in the "users" or "sessions" collections:

Method 1:  GET followed by PUT

  1.  Get a user by calling:

    url: http://openpath.me/users/<id>
      example: http://openpath.me/users/5171a61a1a719e4a04000010
    verb: GET
    body: none

  2.  Modify the JSON object returned (or replace it completely if desired)

  3.  Put the user by calling:

    url: http://openpath.me/users/5171a61a1a719e4a04000010
    verb: PUT
    body: modified version of JSON object

Method 2: Change a single key value on a single object

  1.  Call the following service:

    url: http://openpath.me/update/<collection>/<id>/<key>/<value>
      example: http://openpath.me/update/users/5153c9daf12aa42757000007/name/boblablaw
    verb: PUT
    body: none

OTHER SERVICES

GET   - http://baseurl.com/users 
  - returns the full list of users

POST - http://baseurl.com/users 
  - with some json in the request body, it saves as a new user

DELETE - http://baseurl.com/users/<id> 
  - deletes record of the given id

EMAIL - http://openpath.me/email
  - request type:   POST
  - headers: Content-Type: application/json
  - body: {"to":"asaeed@gmail.com","subject":"test subj","text":"test txt"}

Note, the "to" field can also contain "Jared <jaredlamenzo@gmail.com>, Ahmad <asaeed@gmail.com>"
so that would make the body:
{"to":"Ahmad <asaeed@gmail.com>, Jared <jaredlamenzo@gmail.com>","subject":"test subj","text":"test txt"}

---

We'll be making more specific service calls for our needs 
as we build out user profiles and event profiles. 

**Some important things to note:

1.  When doing a PUT request, you must have the header: Content-Type: application/json
  (or else empty object will be saved)

2.  When doing a PUT request, do NOT include the _id part of the json 
  (or else error will occur)

3.  Before you integrate either of these into your code, we recommend 
using this chrome extension to just play around with these services:
https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm
IMPORTANT: you must be logged in as guest or persona login in a separate chrome tab 
for this to work - these are authenticated services!

4.  IMPORTANT: Since you don't want to have email passwords pushed to the github repo, create 
a config file to store email login/password one level up from the project root.  
Do a git pull, be sure to create a file called "config.js", and put it in the same location 
as the main openPath project folder.  Here are its contents:

// begin config.js
var config = {};

config.email = {};
config.email.user = "username";
config.email.password = "password";
config.email.host = "smtp.gmail.com";

module.exports = config;
// end config.js

====================================================================================

