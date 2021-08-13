const { supabase } = require("../constants");
const { getAppInfo } = require("../parsers/appParser");

async function getExploreFeed() {
	let { data: feed, error } = await supabase.from("Explore").select("*");
	return feed;
}

async function addExploreFeedCategory(category) {
	const { data, error } = await supabase
		.from("Explore")
		.insert([{ title: category }]);

	if (error) {
		return { error: error };
	} else {
		return { success: data };
	}
}

async function addAppToExploreFeed(categoryTitle, appLink) {
	const appID = appLink.replace("https://www.electronjs.org/apps/", "");
	const appInfo = await getAppInfo(appID);

	let { data, error } = await supabase
		.from("Explore")
		.select("apps")
		.eq("title", categoryTitle);
	if (error) {
		return { error: error };
	}
	let apps = [];
	if (data[0] && data[0].apps) apps = data[0].apps;
	const { data: dt, error: err } = await supabase
		.from("Explore")
		.insert([{ title: categoryTitle, apps: [...apps, appInfo] }], {
			upsert: true,
		});

	if (err) {
		return { error: err };
	} else {
		return { success: dt };
	}
}

module.exports = {
	getExploreFeed,
	addAppToExploreFeed,
	addExploreFeedCategory,
};
