module.exports = {
	config: {
		name: "prefix_auto",
		version: "1.0",
		author: "Evan X",
		role: 0,
		description: "Auto-reply stylish panel + Admin info + Global/GC prefix when someone types 'prefix'",
		category: "general"
	},

	onChat: async function({ event, message, threadsData }) {
		if (event.body?.toLowerCase() === "prefix") {

			const globalPrefix = global.GoatBot.config.prefix || "!";
			const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;

			const body =
`🌎 𝐆𝐥𝐨𝐛𝐚𝐥 𝐩𝐫𝐞𝐟𝐢𝐱: ${globalPrefix}
📚 𝐘𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩 𝐩𝐫𝐞𝐟𝐢𝐱: ${threadPrefix}

╭‣ 𝐀𝐝𝐦𝐢𝐧 👑
╰‣ Evan

╭‣ 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐏 ✆
╰‣ 01827799432`;

			return message.reply({ body });
		}
	}
};
