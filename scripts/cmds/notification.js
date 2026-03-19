const { getStreamsFromAttachment } = global.utils;
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "notify",
		aliases: ["notification", "noti"],
		version: "7.0",
		author: "Evan X",
		countDown: 5,
		role: 3,
		description: {
			en: "Send MAXIMUM ULTRA VIP animated premium notification from owner to all groups"
		},
		category: "owner",
		guide: {
			en: "{pn} <message> [optional image/video/audio]"
		},
		envConfig: { delayPerGroup: 300 }
	},

	langs: {
		en: {
			missingMessage: "⚠️ Please enter the message to send to all groups",
			starting: "🚀 Sending MAXIMUM ULTRA VIP notification to %1 groups...",
			success: "✅ Sent to %1 groups successfully!",
			error: "❌ Failed to send to %1 groups:\n%2"
		}
	},

	onStart: async function({ message, api, event, args, threadsData, getLang, envCommands }) {
		const ownerID = ["61584554519161"];
		if (!ownerID.includes(event.senderID)) return message.reply("❌ Only owner can use this command!");
		if (!args[0]) return message.reply(getLang("missingMessage"));

		const content = args.join(" ");

		const userAttachments = await getStreamsFromAttachment(
			[...event.attachments, ...(event.messageReply?.attachments || [])]
			.filter(a => ["photo","png","animated_image","video","audio"].includes(a.type))
		);

		const allGroups = (await threadsData.getAll())
			.filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);

		message.reply(getLang("starting", allGroups.length));

		let successCount = 0;
		const errorList = [];

		for (const t of allGroups) {
			const tid = t.threadID;
			const tmpDir = path.join(__dirname, "..", "cache");
			await fs.ensureDir(tmpDir);
			const gifPath = path.join(tmpDir, `ultra_vip_${tid}.gif`);

			try {
				// 🔥 Ultra Animated VIP API
				const apiUrl = `https://xsaim8x-xxx-api.onrender.com/api/maxUltraVIP?owner=OWNER&message=${encodeURIComponent(content)}`;
				const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
				fs.writeFileSync(gifPath, response.data);

				const msgBody =
`🎆 MAXIMUM ULTRA VIP NOTIFICATION 🎆
🔔 From: OWNER
🕒 Time: ${new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka", hour12:true })}
────────────────────────
📢 Message:
${content.split("\n").map(line => "┃ " + line).join("\n")}
────────────────────────`;

				await api.sendMessage({ body: msgBody, attachment: fs.createReadStream(gifPath) }, tid);

				successCount++;
				fs.unlinkSync(gifPath);
			} catch (err) {
				errorList.push({ tid, error: err.message || err });
			}

			await new Promise(r => setTimeout(r, envCommands.notify.delayPerGroup));
		}

		let report = `${getLang("success", successCount)}`;
		if (errorList.length) report += `\n${getLang("error", errorList.length, errorList.map(e => `- ${e.tid}: ${e.error}`).join("\n"))}`;

		message.reply(report);
	}
};
