var rotten = require('rotten-tomatoes-api');
module.exports = rotten(process.env.ROTTEN_API_KEY || 'yedukp76ffytfuy24zsqk7f5');

