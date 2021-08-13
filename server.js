const express = require("express");
const cors = require("cors");
const appParser = require("./parsers/appParser");
const categoryFeed = require("./feeds/categoryFeed");
const exploreFeed = require("./feeds/exploreFeed");
const { searchApp } = require("./search");

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());

app.listen(port, () => {
	console.log("Server running on port " + port);
});

app.get("/refresh-db", (req, res) => {
	cParser.getApps();
	res.send({ msg: "Refreshing apps DB" });
});

app.get("/get-app", async (req, res) => {
	const appID = req.query.appID;
	const appinfo = await appParser.getAppInfo(appID);
	res.send(appinfo);
});

app.get("/get-category", async (req, res) => {
	const name = req.query.category;
	const category = await categoryFeed.getCategoryFromDB(name);
	res.send(category);
});

app.get("/get-category-list", async (req, res) => {
	const categories = await categoryFeed.getCategoryListFromDB();
	res.send(categories);
});

app.get("/search-app", async (req, res) => {
	const query = req.query.query;
	const results = await searchApp(query);
	res.send(results);
});

app.get("/explore-feed", async (req, res) => {
	const feed = await exploreFeed.getExploreFeed();
	res.send(feed);
});

app.post("/add-explore-category", async (req, res) => {
	const newCategoryname = req.body.name;
	console.log(newCategoryname);
	const response = await exploreFeed.addExploreFeedCategory(newCategoryname);
	res.send(response);
	// res.send("response");
});

app.post("/add-app-to-explore", async (req, res) => {
	const categories = req.body;
	const errorObject = null;
	const successObject = {
		success: [],
	};
	for (const category of categories) {
		for (const appLink of category.appLinks) {
			const response = await exploreFeed.addAppToExploreFeed(
				category.name,
				appLink
			);
			if (response?.error) {
				errorObject = response;
				return;
			}
			successObject.success.push(`Added ${appLink} to ${category.name}`);
		}
	}
	if (errorObject) {
		res.send(error);
	} else {
		res.send(successObject);
	}
});
