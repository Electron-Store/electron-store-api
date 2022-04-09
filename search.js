const {database, COLL_ID} = require('./constants');
const {Query} = require('node-appwrite');
// const search_index = require('./search_index.json');
const lunr = require('lunr');
const fs = require('fs');
const path = require('path');
const appParser = require('./parsers/appParser')

async function searchApp(query, index) {
	try {
		let results = Array.from(index.search(query));
		let resultApps = [];
		for (var result in results) {
			var appID = results[result].ref;
			var appinfo = await appParser.getAppInfo(appID);
			resultApps.push(appinfo);
		}
		return resultApps;
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	searchApp
}