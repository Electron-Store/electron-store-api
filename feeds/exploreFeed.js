const { database, COLL_ID } = require("../constants");
const { getAppInfo } = require("../parsers/appParser");

async function getExploreFeed() {
    let latestApps = [];
    let data = await database.listDocuments(COLL_ID, [], 51, 0, undefined, undefined, ["uploadDate"], ["DESC"]);
    for (app in data.documents) {
        let appData = data.documents[app];
        delete appData['$id'];
        delete appData['$read'];
        delete appData['$write'];
        delete appData['$internalId'];
        delete appData['$collection'];
        appData['logo'] = "https://api.electron-store.org/app-img/" + appData['id'];
        latestApps.push(appData);
    }
    return latestApps;
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
    const appID = appLink.replace("https://api.electron-store.org/apps/", "");
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