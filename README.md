Set up AWS server

Setting Up the server through AWS
Once logged into the Amazon Web Services (AWS) console with the appropriate credentials, navigate to "Services" and select Elastic Compute Cloud (EC2).  Select an appropriate Amazon Machine Image (AMI) (for this I selected Ubuntu Server).  

Create an AWS instance. The steps "Configure Instance Details", "Add Storage", and "Add Tags" can be left at the default settings. 

For the step "Configure Security Group" you can create a new security group giving it a relevant name. In order to serve an app, click "Add Rule" select type "HTTP" and add "80" as the Port Range.

Click "Launch"  create a new key pair, and download the key pair.  Save the .pem file for the key in the computer's .ssh file. Select "Launch Instance and then View Instances."

Connecting to the Instance through the Terminal
Once the instance is running, open up the terminal, and set permissions for the key by running
 $ chmod 400 ~/.ssh/key-name.pem

Connect to the instance in your terminal by running:
	ssh -i ~/.ssh/whatever-your-key-name-is.pem      ubuntu@ec2-52-214-64-31.eu-west-1.compute.amazonaws.com

Install Node Version Manager (NVM) by running:
	$ curl -o- 
https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash

Run the ~bachrc file b running

$ source ~/.bashrc

Install node by running 
	$ nvm install latest version

Setting up HTTP endpoint
Create a directory to contain the server and cd into, by running:
	$ mkdir server
$ cd server

 then start npm by running:
npm init

Install express by running:
 $ npm install express --save-dev

Create an index.js file in the server. I used nano to edit the file by running:
		$ nano index.js

I gave it a very basic server code, which could be made more complex if needed.

const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello, world!')
})
app.listen(3000, () => console.log('Server running on port 3000'))

We can start the server by running:
	Node index.js

To run the app on Port 3000, go back to the EC2 console, go to "Security Groups" right click the security group for this instance, click "edit inbound rules" and click "add rule". Select a "Custom TCP rule" and set the port range to 3000.

Select crl+x in the terminal to pause the server and  to run the server in the background run:
  $ bg %1
To logout run: 
$exit 

Setup Nginx and Connect to Port 80
Install nginx by running:
 sudo apt-get install nginx

Remove the default config file by running: 
sudo rm /etc/nginx/sites-enabled/default

Create a  new config file
sudo nano /etc/nginx/sites-available/express-server

server {
  listen 80;
  server_name express-server;
  location / {
    proxy_set_header  X-Real-IP  $remote_addr;
    proxy_set_header  Host       $http_host;
    proxy_pass        http://127.0.0.1:3000;
  }
}

Link the config file in sites enabled by running:
$ sudo ln -s /etc/nginx/sites-available/tutorial /etc/nginx/sites-enabled/tutorial

Restart nginx by running:
$ sudo service nginx restart

Start the app by running:
node tutorial/index.js
Pause server by running:
 ctrl+z & 

resume the app as a background task by running:
  bg %1

Stop running the node process by running: 
# Nukes all Node processes
killall -9 node

Install PM2 by running:

$npm i -g pm2

Ensure the PMz restarts with the server by running:
$pm2 startup


Start server by running: 
pm2 start server/index.js

Save the code by running:
pm2 save

Deploying Content
Create a GitHub repository
Create and index.js file in the repo with same script as the index.js made previously

	Ignore node_moduels and commit the repo.

SSH into the server and generate a key pair, and save it in GitHub.

Clone the github by running
	Git clone: git url

In the local version of the project, install npm globally:

The create a config file named: ecosystem.config.js
module.exports = {
  apps: [{
    name: 'aws-server',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-188-229-1.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/express.pem',
      ref: 'origin/master',
      repo: 'https://github.com/reperez120/aws-server.git',
      path: '/home/ubuntu/aws-server',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}

Setup the directories on the remote by running: 
pm2 deploy ecosystem.config.js production setup

Commit the changes

Run the deploy command:
	pm2 deploy ecosystem.config.js production

Add the below deploy and restart script to package.json: 
	"restart": "pm2 startOrRestart ecosystem.config.js",
   "deploy": "pm2 deploy ecosystem.config.js production",

Install PM2 locally and save, using --save-dev: 
npm i pm2 --save-dev


Commit changes  and deploy running: 
	npm run-script deploy
Make sure the app restarts with server running:
	pm2 save

To serve an HTML file, add a public directory
In the public file, create an index.html file with the content you wish to run 
Deploy the changes again running: 
npm run-script deploy



Link to GitHub: https://github.com/reperez120/aws-server
