const { supabase } = require("../constants");

async function pushCategoryToDB(category) {
	const { data, error } = await supabase
		.from("Categories")
		.insert(
			[{ name: category.name, icon: category.icon, apps: category.apps }],
			{ upsert: true }
		);
	if (error) {
		console.log(error);
		return {
			error: error,
		};
	} else {
		console.log("DB refreshed");
	}
}

async function getCategoryFromDB(categoryName) {
	let { data: category, error } = await supabase
		.from("Categories")
		.select("*")
		.eq("name", categoryName);

	if (error) {
		console.log(error);
		return {
			error: error,
		};
	} else {
		console.log(category);
		return category[0];
	}
}

async function getCategoryListFromDB() {
	let { data: categories, error } = await supabase
		.from("Categories")
		.select("name,icon");
	if (error) {
		console.log(error);
		return {
			error: error,
		};
	} else {
		console.log(categories);
		return categories;
	}
}

module.exports = {
	pushCategoryToDB,
	getCategoryFromDB,
	getCategoryListFromDB,
	getCategoryFromDB,
};
