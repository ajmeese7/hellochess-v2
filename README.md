# hellochess

Setup:
Modify config.js to look like below:

    module.exports = {
        secret: 'placeRandomStringHere',
        facebookAuth: {
            clientID: '',
            clientSecret: '',
            callbackURL: '',
            profileFields: ['id', 'email', 'name', 'picture', 'friends'],
            fields: "id, email, name, picture"
        },
        googleAuth: {
            GoogleClientID: '',
            GoogleClientSecret: ''
        }
    }

`npm install`


Make sure you have MongoDB installed and run the following command from the hellochess-v2 folder:

`mongod --config mongodb.conf --dbpath data`

For development purposes I run the webpack dev server on localhost:8080
to run the webpack dev server:

`npm start`

The backend runs on localhost:3000 which I run as below:

`nodemon server/server.js`

Visit localhost:8080 and hope everything works!
