const { supabase } = require("./constants");

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
	searchApp,
};
