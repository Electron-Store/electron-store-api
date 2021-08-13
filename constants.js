const supabaseSDK = require("@supabase/supabase-js");
const supabaseUrl = "https://pxfnmafyqvdhzxosxcqw.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODYxMDMzMCwiZXhwIjoxOTQ0MTg2MzMwfQ.Uxy2KiZ1meiAovuckfofcW8igoXcHcE9SETrRR6BUsY";
const supabase = supabaseSDK.createClient(supabaseUrl, supabaseKey);

module.exports = {
	supabase,
};
