OpenPath Implementation


Our first steps at connecting place-based learning. 
This is part of our development in rounds one and two of Mozilla Ignite.
http://openpathme.tumblr.com/

Our WebRTC videochat code is located here: 
://github.com/vanevery/openpath/blob/master/README.md

part of Mozilla Ignite (mozillaignite.org)

Our pitch is here:

https://mozillaignite.org/apps/438/

Thanks!

====================================================================================
OpenPath's data model is divided into users, sessions, and events.
Look at the datamodel file to learn how it is structured.
So far, we have provided calls for users and sessions only.

Both the User and Session service API's follow the standard "RESTful" setup and include the following methods 
(these will mostly be removed eventually)

GET   - http://baseurl.com/users 
  - returns the full list of users
GET   - http://baseurl.com/users/<id> 
  - returns record of given ID
POST - http://baseurl.com/users 
  - with some json in the request body, it saves as a new user
PUT   - http://baseurl.com/users/<id> 
  - with some json int the body, overwrites record of given id 
DELETE - http://baseurl.com/users/<id> 
  - deletes record of the given id

We'll be making more specific service calls for our needs as we built out user profiles and event profiles.  

For example:
GET  - http://baseurl.com/users/<id>/<key>/<value> 
  - this could be used to add field <key> with value <value> to user of id <id>
    (for example where <key> is nickName and <value> is ColdHeartedNinja)

another convention we may go with is:
GET  - http://baseurl.com/users/update?id=<id>&<key>=<value>
