const express = require("express");
const cors = require("cors");
const appParser = require("./parsers/appParser");
const categoryFeed = require("./feeds/appFeed");
const exploreFeed = require("./feeds/exploreFeed");
const { searchApp } = require("./search");
const cParser = require('./parsers/categoryParser')
const { createProxyMiddleware } = require('http-proxy-middleware');
const { default: axios } = require("axios");
const request = require('request');
const { database, COLL_ID } = require('./constants');
const { Query } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

const app = express();
app.use(cors({ "Access-Control-Allow-Origin": "*" }));
app.use('/apps', createProxyMiddleware({ target: 'https://www.electronjs.org', changeOrigin: true }));
app.use('/styles', createProxyMiddleware({ target: 'https://www.electronjs.org', changeOrigin: true }));
app.use('/images', createProxyMiddleware({ target: 'https://www.electronjs.org', changeOrigin: true }));
app.use('/scripts', createProxyMiddleware({ target: 'https://www.electronjs.org', changeOrigin: true }));
app.use('/fonts', createProxyMiddleware({ target: 'https://www.electronjs.org', changeOrigin: true }));

const port = process.env.PORT || 5800;
const search_index = fs.readFileSync(path.join(__dirname, 'search_index.json'), 'utf8');
let index = lunr.Index.load(JSON.parse(search_index));

app.use(express.json());

app.listen(port, () => {
    console.log("Server running on port " + port);
});

app.get("/refresh-db", (req, res) => {
    cParser.getApps();
    res.send({ msg: "Refreshing apps DB" });
});

app.get("/get-app", async(req, res) => {
    const appID = req.query.appID;
    const appinfo = await appParser.getAppInfo(appID);
    res.send(appinfo);
});

app.get("/get-category", async(req, res) => {
    const name = req.query.category;
    const category = await categoryFeed.getCategoryFromDB(name);
    // console.log(category)
    res.send(category);
});

app.get("/get-category-list", async(req, res) => {
    const categories = await cParser.getCategories();
    res.send(categories);
});

app.get("/search-app", async(req, res) => {
    const query = req.query.query;
    const results = await searchApp(query, index);
    res.send(results);
});

app.get("/explore-feed", async(req, res) => {
    const feed = await exploreFeed.getExploreFeed();
    res.send(feed);
});

app.get('/app-img/:app', async(req, res) => {
    const app = req.params.app;
    try {
        request({
                url: `https://raw.githubusercontent.com/electron/apps/master/apps/${app}/${app}-icon.png`,
                encoding: null
            },
            (err, resp, buffer) => {
                if (!err && resp.statusCode === 200) {
                    res.header('Content-Type', 'image/png');
                    res.send(buffer);
                }
            });
    } catch (err) {
        console.log(err);
    }
})

app.get('/app-readme/:app', async(req, res) => {
    const app = req.params.app;
    try {
        const readme = await axios({
            url: `https://raw.githubusercontent.com/electron/apps/master/meta/readmes.json`,
            method: 'GET',
        })
        const readmeData = readme.data;
        const readmeContent = readmeData[app];
        res.send(readmeContent ? readmeContent.readmeCleaned : '');
    } catch (err) {
        console.log(err);
    }
})

app.get('/app-releases/:app', async(req, res) => {
    const app = req.params.app;
    try {
        const releases = await axios({
            url: `https://raw.githubusercontent.com/electron/apps/master/meta/releases.json`,
            method: 'GET',
        })
        const releasesData = releases.data;
        const releasesContent = releasesData[app];
        const releasesArray = [];
        const filesArray = releasesContent ? Array.from(releasesContent.latestRelease.assets) : []
        for (const file of filesArray) {
            const fileName = file.name;
            const fileUrl = file.browser_download_url;
            releasesArray.push({ name: fileName, src: fileUrl })
        }
        res.send(releasesArray)
    } catch (err) {
        console.log(err);
    }
})