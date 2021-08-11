const parser = require("node-html-parser")
const { createRequest } = require("./services");

async function getAppInfo(id) {
    const html = await createRequest(`/${id}`)
    const root = parser.parse(html);
    const metaTrays = root.querySelectorAll('.app-meta-entry')
    const metaInfo = Array.from(metaTrays).map(tray => {
        const meta = {
            title: tray.querySelector('h5')?.textContent.trim() || "",
            data: tray.querySelector('a')?.textContent.trim() || tray.querySelector('span')?.textContent.trim() || ""
        }
        return meta
    })
    const appInfo = {
        name: root.querySelector('h1').textContent.trim(),
        description: root.querySelector('h3').textContent,
        icon: "https://www.electronjs.org" + root.querySelector(".CircleBadge-icon").getAttribute('src'),
        meta: metaInfo,
        readme: root.querySelector("#readme")?.innerHTML || ""
    }
    return appInfo
}


module.exports = {
    getAppInfo,
}