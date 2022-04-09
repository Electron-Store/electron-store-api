const parser = require("node-html-parser");
const { createRequest } = require("../utils");
const {database, Query, COLL_ID} = require('../constants');
const axios = require('axios');

// function toBase64(url,callback){
// 	var request = require('request').defaults({ encoding: null });
// 	if (url.startsWith("data:")) callback(url);
// 	if (url.startsWith("file:")) callback(url);
// 	request.get(url, function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
// 			callback(data);
// 		}
// 	});
// }

async function getAppInfo(id) {
	try {
		appInfo = await database.getDocument(COLL_ID, id);
		delete appInfo['$id'];
		delete appInfo['$internalId'];
		delete appInfo['$collection'];
		delete appInfo['$read'];
		delete appInfo['$write'];
		const appReadme = await axios({url: `https://api.electron-store.org/app-readme/${id}`, method: "GET"});
		const appReleases = await axios({url: `https://api.electron-store.org/app-releases/${id}`, method: "GET"});
		return {
			...appInfo,
			logo: `https://api.electron-store.org/app-img/${id}`,
			readme: appReadme.data,
			latestRelease: appReleases.data,
		}
	} catch (err) {
		console.log(err)
	}
}

function processFiles(aTags) {
	const links = Array.from(aTags);
	const files = links.map((link) => {
		const fileInfo = {
			name: link.textContent,
			src: link.getAttribute("href"),
		};
		return fileInfo;
	});
	return files;
}

module.exports = {
	getAppInfo,
};
