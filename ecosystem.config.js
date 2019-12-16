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