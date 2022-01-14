const environment = process.env.NODE_ENV || 'development'
console.log("THIS IS RESULT OF ENVIRONMENT...", environment);
const config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);