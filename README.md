# Safari push: serverside #

Code to setup endpoints in node.js needed by Safari for push notification.

This project does **NOT** include a pushfarm for sending push notifications to subscribers. You might look into [node-apn](https://github.com/argon/node-apn) for that

Demo for deredactie.be (VRT) hosted on [heroku](https://wingsafariendpoint.herokuapp.com). 

**Client side repo:** https://github.com/damianleung/safari-push-clientside

**Demo:** http://vrt-cc.s3-website-eu-west-1.amazonaws.com/safaripush

##1. Create push package
- Create .p12 certificate on http://developer.apple.com
- Add .p12 certificate to the root of the project
- Fill in the variables at the top of node_package_maker.js
- Create pushpackage: `node node_package_maker.js`

##2. Setup server endpoint
- Fill in the variables at the top of node_http_server.js
- Launch the server: `node node_http_server.js`

##3. Launch it on heroku
- heroku create *[projectname]*
- git push heroku master
