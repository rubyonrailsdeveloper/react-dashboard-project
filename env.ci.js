// This configuration is used during CI builds
module.exports = {
  // The API entry point
  API_BASE: process.env.API_BASE || 'http://35.186.225.106/api/v1',

  // The path where the application will be running at, set this if the application is running
  // on a subdirectory: if desired URL is www.streamlio.com/path/to/app, PUBLIC_PATH should
  // be '/path/to/app'
  PUBLIC_PATH: process.env.PUBLIC_PATH || '/',
}
