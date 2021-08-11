const express = require('express')

const app = express();

const cParser = require('./categoriesParser')
const services = require('./services')
const appParser = require('./appParser')

const port = process.env.PORT || 5000

app.use(express.json())

app.listen(port, () => {
    console.log("Server running");
})

app.get('/refresh-db', (req, res) => {
    cParser.getApps()
    res.send({ msg: "Refreshing apps DB" })
})

app.get('/get-app', async (req, res) => {
    const appID = req.body.appID
    const appinfo = await appParser.getAppInfo(appID)
    res.send(appinfo)
})

app.get('/get-category', async (req, res) => {
    const name = req.body.category;
    const category = await services.getCategoryFromDB(name);
    res.send(category);
})

app.get('/get-category-list', async (req, res) => {
    const categories = await services.getCategoryListFromDB()
    res.send(categories)
})

app.get('/search-app', async (req, res) => {
    const query = req.body.query
    const results = await services.searchApp(query)
    res.send(results)
})