const {database, COLL_ID} = require('./constants.js');
import {Models} from "node-appwrite";
import lunr from "lunr";
import fs from "fs";
import path from "path";

(async () => {
    const allDocuments: Models.Document[] = [];
    const cursorMagazine: string[] = [];
    let wasPageEmpty = false;
    let isFirstLoad = true;

    while (!wasPageEmpty) {
        let chunkResponse: Models.DocumentList<Models.Document> | null = null;

        while (isFirstLoad || (chunkResponse === null && cursorMagazine.length > 0)) {
            isFirstLoad = false;

            const lastCursor = cursorMagazine[cursorMagazine.length - 1] || undefined;

            try {
                chunkResponse = await database.listDocuments(COLL_ID, undefined, 100, undefined, lastCursor, "after");
            } catch (err: any) {
                const isCursorMissingError = err.response.code === 400 && err.response.message === `Document '${lastCursor}' for the 'cursor' value not found.`;

                if (!isCursorMissingError) {
                    throw err;
                }

                cursorMagazine.pop();
            }
        }

        if (!chunkResponse) {
            // There is no change this happens 😅 You would need to delete 100 documents during seconds request, or 200 during third, or 300 during fourth...
            throw new Error("All documents we had so far were removed. We cannot properly continue the loop");
        }

        const chunkDocuments = chunkResponse.documents;
        allDocuments.push(...chunkDocuments);

        const chunkIds = chunkResponse.documents.map((document) => document.$id);
        cursorMagazine.push(...chunkIds);

        wasPageEmpty = chunkDocuments.length <= 0;
    }
    var index = lunr(function () {
        this.ref('id');
        this.field('name');
        this.field('title');
        this.field('description');
        this.field('category');
        this.field('keywords');
        this.field('developer');
        allDocuments.forEach((app: any) => {
            this.add(app);
        }, this);
    }
    );
    // console.log(index.search('Unofficial'))
    fs.writeFileSync(path.join(__dirname, 'search_index.json'), JSON.stringify(index));
})().catch((err) => {
    console.error(err);
    // console.error("Could not get all documents");
    process.exit();
})