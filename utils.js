const axios = require("axios");
const BASE_URL = "https://www.electronjs.org/apps";

async function createRequest(subUrl = "") {
	let reqOptions = {
		url: `${BASE_URL}${subUrl}`,
		method: "GET",
	};
	try {
		const response = await axios.request(reqOptions);
		return await response.data;
	} catch (error) {
		return null;
	}
}

module.exports = {
	createRequest,
};
