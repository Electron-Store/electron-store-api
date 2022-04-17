const { database, COLL_ID } = require('../constants');
const { Query } = require('node-appwrite')
const { getCategories, BASE_IMAGE_URL } = require('../parsers/categoryParser');

// function containsObject(obj, list) {
//     var i;
//     for (i = 0; i < list.length; i++) {
//         if (list[i] === obj) {
//             return true;
//         }
//     }

//     return false;
// }

async function pushAppToDB(app) {
    // console.log(category);
    // console.log(app)
    try {
        const appInfoFetched = await database.listDocuments(COLL_ID, [Query.equal('id', app.id)])
        if (appInfoFetched.documents.length == 1) {
            // App Exists but maybe outdated
            if (appInfoFetched.documents[0] == app) {
                // nothing updated
            } else {
                // Updated!
                const res = database.updateDocument(COLL_ID, app.id, app);
                if (res) {
                    console.log(res)
                }
            }
        } else {
            // App doesn't exist
            const res = database.createDocument(COLL_ID, app.id, app)
            if (res) {
                console.log(res);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function getCategoryFromDB(categoryName) {
    try {
        let category = await database.listDocuments(COLL_ID, [Query.equal('category', categoryName)], 51, 0)
        let apps = [];
        categoryList = [];
        while (category.documents.length > 0) {
            for (let singleCategory in category.documents) {
                let app = category.documents[singleCategory];
                delete app['$id'];
                delete app['$read'];
                delete app['$write'];
                delete app['$internalId'];
                delete app['$collection'];
                app['logo'] = "https://api.electron-store.org/app-img/" + app['id'];
                apps.push(app);
            }
            categoryList = categoryList.concat(apps);
            category = await database.listDocuments(COLL_ID, [Query.equal('category', categoryName)], 51, categoryList.length);
        }
        if (categoryList.length > 0) {
            // Apps of this category exists
            // console.log(documents)
            return categoryList;
        } else {
            return { error: `Category ${categoryName} not found!` }
        }
    } catch (err) {
        console.log(err);
    }
}

async function getCategoryListFromDB() {
    // let { data: categories, error } = await supabase
    // 	.from("Categories")
    // 	.select("name,icon");
    // if (error) {
    // 	console.log(error);
    // 	return {
    // 		error: error,
    // 	};
    // } else {
    // 	// console.log(categories);
    // 	return categories;
    // }
    try {
        const categories = Array.from(await getCategories())
        let categoryList = [];
        categories.forEach((category) => {
            const c = {
                name: category.name,
                icon: `${BASE_IMAGE_URL}${category.slug}-icon.svg`
            }
            categoryList.push(c);
        })
        return categoryList;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    pushAppToDB,
    getCategoryFromDB,
    getCategoryListFromDB,
    // getCategoryFromDB,
};