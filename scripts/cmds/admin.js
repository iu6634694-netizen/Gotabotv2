const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

// 👉 তোমার UID (OWNER)
const OWNER_UID = "61584554519161";

// 👉 auto add owner if not exist
if (!config.adminBot.includes(OWNER_UID)) {
	config.adminBot.push(OWNER_UID);
	writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
}

module.exports = {
	config: {
		name: "admin",
		version: "2.0",
		author: "Evan X Saimx",
		countDown: 5,
		role: 2,
		description: "Advanced Admin System",
		category: "box chat"
	},

	onStart: async function ({ message, args, usersData, event }) {

		// ❌ Only owner can use admin command
		if (event.senderID !== OWNER_UID) {
			return message.reply("❌ | Only Owner can use this command!");
		}

		switch (args[0]) {

			// ✅ ADD ADMIN
			case "add":
			case "-a": {
				if (!args[1]) return message.reply("⚠️ | UID or tag dao");

				let uids = [];
				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				let added = [], already = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						already.push(uid);
					else {
						config.adminBot.push(uid);
						added.push(uid);
					}
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(
					`✅ Added:\n${added.join("\n") || "None"}\n\n⚠️ Already Admin:\n${already.join("\n") || "None"}`
				);
			}

			// ❌ REMOVE ADMIN
			case "remove":
			case "-r": {
				if (!args[1]) return message.reply("⚠️ | UID or tag dao");

				let uids = [];
				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else
					uids = args.filter(arg => !isNaN(arg));

				let removed = [], notAdmin = [];

				for (const uid of uids) {

					// 🔥 Owner protection
					if (uid === OWNER_UID) {
						return message.reply("❌ | Owner ke remove kora jabe na!");
					}

					if (config.adminBot.includes(uid)) {
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
						removed.push(uid);
					}
					else notAdmin.push(uid);
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(
					`✅ Removed:\n${removed.join("\n") || "None"}\n\n⚠️ Not Admin:\n${notAdmin.join("\n") || "None"}`
				);
			}

			// 📋 LIST ADMIN
			case "list":
			case "-l": {
				let list = config.adminBot
					.map(uid => `👑 ${uid === OWNER_UID ? "OWNER" : "ADMIN"} ➤ ${uid}`)
					.join("\n");

				return message.reply(`📋 Admin List:\n\n${list}`);
			}

			default:
				return message.reply(
					"Use:\n- admin add @user\n- admin remove @user\n- admin list"
				);
		}
	}
};
