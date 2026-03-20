// File name: prefix_auto.js
const { utils } = global;

module.exports = {
	config: {
		name: "prefix_auto",
		version: "1.0",
		author: "Evan X",
		role: 0,
		description: "Auto-reply stylish panel + Jani + admin info when someone types 'prefix'",
		category: "general"
	},

	onChat: async function({ event, message, threadsData }) {
		// Check if someone typed 'prefix' (case-insensitive)
		if (event.body?.toLowerCase() === "prefix") {

			// Get global and thread-specific prefix
			const globalPrefix = global.GoatBot.config.prefix || "!";
			const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;

			// Prepare reply
			const body =
`╔══『 𝐏𝐑𝐄𝐅𝐈𝐗 』══╗
║ 🌎 Global Prefix : ${globalPrefix}
║ 💬 Chat Prefix   : ${threadPrefix}
║
╭‣ 𝐀𝐝𝐦𝐢𝐧 👑
╰‣ Evan
╭‣ 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 ✆
╰‣ 01827799432
╚═════════════════╝
Jani`;

			// Send reply
			return message.reply({ body });
		}
	}
};
