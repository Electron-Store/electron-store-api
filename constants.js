// const supabaseSDK = require("@supabase/supabase-js");
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = supabaseSDK.createClient(supabaseUrl, supabaseKey);

const APPWRITE_KEY = process.env.APPWRITE_KEY;
const PROJ_ID = "electron-store";
const COLL_ID = "apps";

// module.exports = {supabase};
const sdk = require('node-appwrite');

// Init SDK
let client = new sdk.Client();

let database = new sdk.Database(client);

client
    .setEndpoint('https://backend.electron-store.org/v1') // Your API Endpoint
    .setProject(PROJ_ID) // Your project ID
    .setKey(APPWRITE_KEY) // Your secret API key
    ;

module.exports = {
    database,
    COLL_ID
}