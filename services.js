const axios = require("axios");
const supabaseSDK = require("@supabase/supabase-js");

const supabaseUrl = "https://pxfnmafyqvdhzxosxcqw.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODYxMDMzMCwiZXhwIjoxOTQ0MTg2MzMwfQ.Uxy2KiZ1meiAovuckfofcW8igoXcHcE9SETrRR6BUsY";
const supabase = supabaseSDK.createClient(supabaseUrl, supabaseKey);

const BASE_URL = "https://www.electronjs.org/apps";

async function createRequest(subUrl = "") {
	let reqOptions = {
		url: `${BASE_URL}${subUrl}`,
		method: "GET",
	};
	console.log(reqOptions.url);
	try {
		const response = await axios.request(reqOptions);
		return await response.data;
	} catch (error) {
		//  console.log(error);
		return null;
	}
}

async function pushCategoryToDB(category) {
	const { data, error } = await supabase
		.from("Categories")
		.insert(
			[{ name: category.name, icon: category.icon, apps: category.apps }],
			{ upsert: true }
		);
	if (!error) {
		console.log("DB refreshed");
	} else {
		console.log(error);
	}
}

async function getCategoryFromDB(categoryName) {
	let { data: category, error } = await supabase
		.from("Categories")
		.select("*")
		.eq("name", categoryName);

	if (!error) {
		console.log(category);
		return category[0];
	} else {
		console.log(error);
	}
}

async function getCategoryListFromDB() {
	let { data: categories, error } = await supabase
		.from("Categories")
		.select("name,icon");
	if (!error) {
		console.log(categories);
		return categories;
	} else {
		console.log(error);
	}
}

async function searchApp(query) {
	query = query.toLowerCase();
	let { data: categories, error } = await supabase
		.from("Categories")
		.select("apps");
	const apps = categories.map((obj) => obj.apps).flat();
	const results = apps.filter(
		(app) =>
			app.name.toLowerCase().includes(query) || app.keywords.includes(query)
	);
	console.log(results);
	return results;
}

module.exports = {
	createRequest,
	pushCategoryToDB,
	getCategoryFromDB,
	getCategoryListFromDB,
	searchApp,
};
