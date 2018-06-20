# hellochess

## Setup:
In the `config` folder, add a file named `config.js` with the following content:

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
      },

      production: '',
      staging: '',
      staging2: '',
      local: ''
    }

Of course, you need to fill in the empty Facebook and Google fields with actual
information. For googleAuth, go [here](https://developers.google.com/identity/sign-in/web/devconsole-project)
and follow the instructions. For facebookAuth, get the information by registering an app
[here](https://developers.facebook.com/docs/apps/register).

### Facebook
When creating the Facebook app, I just pasted an HTML file with the following contents
on my web server and linked to it for the privacy policy:

  ```
  <html>
    <body>
      <p>As far as I know, this project doesn't take any of your information.</p>
    </body>
  </html>
  ```

If you don't have access to a web server, simply look up some guides to follow. There's
some information on StackOverflow that I saw in my search.

For the callbackURL field, I used `http://localhost:8080`. I still don't know if that
works, but so far in my development process it hasn't given me any problems.

## Installation
**NOTE**: All commands below should be ran from a terminal in the hellochess-v2 folder.
I have run all these on Linux and cannot promise that they will work on any other
OS. If you have any problems, please raise an issue and I will see what I can do.

To get all the packages on your system properly, run:

`npm install`

Make sure you have MongoDB installed, create a folder in the main repository
labeled `data`, and run:

`npm run datapath`

The below command properly runs the files with ts-node, which will be able to interpret
the Typescript and ES6 code. The backend runs on `localhost:3000`, which is started by running:

`npm run server`

For development purposes I run the webpack dev server on localhost:8080.
To start the webpack dev server, run:

`npm start`

Visit `localhost:8080` and hope everything works!

## Troubleshooting
#### MongoDB
If you experience problems running `npm run datapath` or `npm run server`, it may be because there
is a problem with your Mongo install. Create a configuration file by running:
`sudo nano /etc/systemd/system/mongodb.service`

Start the service by running:
`sudo systemctl start mongodb`

Check the service:
`sudo systemctl status mongodb`

And make the service permenant:
`sudo systemctl enable mongodb`

#### Other
If you experience an ENOSPC error or an inotify limit message when running the above command, run:

`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

then try again. If that doesn't work, try rebooting your system.
