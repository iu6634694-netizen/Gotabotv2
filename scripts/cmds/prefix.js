// prefix.js
module.exports = {
	config: {
		name: "prefix",
		version: "1.0",
		author: "Evan X",
		role: 0,
		description: "Shows Jani + admin info",
		category: "general"
	},

	onStart: async function({ message, threadsData, api }) {
		const globalPrefix = global.GoatBot.config.prefix;
		const threadPrefix = await threadsData.get(message.threadID, "data.prefix") || globalPrefix;

		const body =
`🌎 𝐆𝐥𝐨𝐛𝐚𝐥 𝐩𝐫𝐞𝐟𝐢𝐱: ${globalPrefix}
📚 𝐘𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩 𝐩𝐫𝐞𝐟𝐢𝐱: ${threadPrefix}

╭‣ 𝐀𝐝𝐦𝐢𝐧 👑
╰‣ Evan

╭‣ 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 ✆
╰‣ 01827799432`;

		return api.sendMessage(body, message.threadID);
	}
};
