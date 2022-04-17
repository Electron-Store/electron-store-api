const parser = require("node-html-parser");
const { createRequest } = require("../utils");
// const { pushAppToDB } = require('../feeds/appFeed')
const axios = require('axios');
const yaml = require('js-yaml');

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

const BASE_IMAGE_URL =
    "https://pxfnmafyqvdhzxosxcqw.supabase.io/storage/v1/object/public/images/icons/";

async function getCategories() {
    try {
        const categoryRAW = await axios({ url: "https://raw.githubusercontent.com/electron/apps/master/meta/categories.json", method: "GET" });
        const categories = categoryRAW.data;
        let categoryNames = [];
        for (let category in categories) {
            categoryNames.push(categories[category].name);
        }
        return categoryNames;
    } catch (err) {
        console.log(err);
    }
}

async function getApps() {
    try {
        // const categories = await getCategories();
        // categories.forEach(async (category) => {await getCategoryApps(category)});
        return await getCategoryApps();
        // console.log(categories.length)
        // console.log(await getCategoryApps(categories))
    } catch (err) {
        console.log(err)
    }
}

async function getCategoryApps() {
    try {
        // // category = parser.parse(category)
        // console.log(category)
        // let html;
        // html = await createRequest(
        // 		`?category=${category.toLowerCase().replace(' & ', '-').replace(/\s/, "-")}`
        // )
        // const root = parser.parse(html);
        // const listedApps = root.querySelectorAll(".listed-app");
        // return listedApps.forEach(async (app) => {
        // 	// console.log(app)
        // 	const name = app.querySelector(".listed-app-name").textContent;
        // 	const id = app
        // 		.querySelector("a")
        // 		.getAttribute("href")
        // 		.replace("/apps/", "");
        // 	const description = app.querySelector(
        // 		".listed-app-description"
        // 	).textContent;
        // 	let IMG_URL = "https://api.electron-store.org" + app.querySelector(".listed-app-logo").getAttribute("data-src");
        // 	toBase64(IMG_URL, (data) => {
        // 		IMG_URL = data
        // 	})
        // 	const logo = IMG_URL;
        // 	const uploadDate =
        // 		app.querySelector(".listed-app-add-date")?.querySelector("span")
        // 			?.textContent || "";
        // 	const keywords =
        // 		app.querySelector(".listed-app-keywords")?.textContent.trim() || "";

        // 	const appInfo = {
        // 		id,
        // 		name,
        // 		description,
        // 		logo,
        // 		uploadDate,
        // 		keywords,
        // 		category,
        // 		developer: 'unclaimedapps@electron-store.org'
        // 	};
        // 	return await pushAppToDB(appInfo);
        // });
        const appsNameList = await getAppList();
        // const releases = await axios({url: "https://raw.githubusercontent.com/electron/apps/master/meta/releases.json", method: "GET"});
        const dates = await axios({ url: "https://raw.githubusercontent.com/electron/apps/master/meta/dates.json", method: "GET" });
        return appsNameList.forEach(async(appName) => {
            try {
                // console.log(appName)
                const res = await axios({ url: `https://raw.githubusercontent.com/electron/apps/master/apps/${appName}/${appName}.yml`, method: "GET" })
                if (res.status == 200) {
                    const appYAML = res.data;
                    const appData = yaml.load(appYAML)
                    const app = {
                        id: appName,
                        name: appData.name,
                        description: appData.description,
                        keywords: appData.keywords ? appData.keywords.join(',') : '',
                        repo: appData.repository,
                        website: appData.website,
                        category: appData.category,
                        license: appData.license,
                        developer: "electron-store@oneid",
                        claimed: false,
                        uploadDate: dates.data[appName]
                    }
                    return await require('../feeds/appFeed').pushAppToDB(app);
                }
            } catch (err) {
                if (err.response) {
                    // Axios Request Error
                    if (err.response.status == 404) {
                        // Electron Apps repo bug
                    } else {
                        // Actual error
                        console.log(err.response.status);
                    }
                } else {
                    // Something else happened while requesting
                    console.log(err);
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
}

async function getAppList() {
    try {
        const res = await axios({ url: 'https://raw.githubusercontent.com/electron/apps/master/meta/dates.json', method: "GET" });
        const numberOfApps = Object.keys(res.data);
        // console.log(numberOfApps.length)
        return numberOfApps;
        // console.log(res.data)
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getApps,
    getAppList,
    getCategories,
    getCategoryApps,
    BASE_IMAGE_URL,
};