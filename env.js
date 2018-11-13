module.exports = {
  // The API entry point
  API_BASE: process.env.API_BASE || ' http://35.227.215.40/api/v1',

  // The path where the application will be running at, set this if the application is running
  // on a subdirectory: if desired URL is www.streamlio.com/path/to/app, PUBLIC_PATH should
  // be '/path/to/app'
  PUBLIC_PATH: process.env.PUBLIC_PATH || '/',

  // Whether the app requires users to authenticate or it's run publicly
  ENABLE_AUTH: process.env.ENABLE_AUTH || true,
}
