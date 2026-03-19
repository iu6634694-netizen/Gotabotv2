module.exports = {
	config: {
		name: "eco",
		aliases: ["balance", "bal", "daily", "pay", "rank", "bank"],
		version: "3.0",
		author: "Evan X",
		countDown: 5,
		role: 0,
		category: "economy"
	},

	onStart: async function ({ message, usersData, event, args }) {

		const uid = event.senderID;
		const data = await usersData.get(uid) || {};

		const name = data.name || "User";
		let money = data.money || 0;
		let bank = data.bank || 0;

		const cmd = args[0];

		// 💳 BALANCE CARD
		if (!cmd || cmd === "balance" || cmd === "bal") {
			return message.reply(
`╭━━━💳 𝗕𝗔𝗡𝗞 𝗖𝗔𝗥𝗗 ━━━╮
┃ 👤 Name : ${name}
┃ 🆔 UID  : ${uid}
┃ 💰 Cash : ${money}$
┃ 🏦 Bank : ${bank}$
╰━━━━━━━━━━━━━━━━━━╯`
			);
		}

		// 🎁 DAILY
		if (cmd === "daily") {
			const now = Date.now();

			if (data.lastDaily && now - data.lastDaily < 86400000)
				return message.reply("⏳ | Already claimed! Come tomorrow.");

			const reward = 1000;

			await usersData.set(uid, {
				money: money + reward,
				lastDaily: now
			});

			return message.reply(`🎁 | You got ${reward}$`);
		}

		// 💸 PAY
		if (cmd === "pay") {
			const receiver = Object.keys(event.mentions)[0];
			const amount = parseInt(args[2]);

			if (!receiver || isNaN(amount))
				return message.reply("⚠️ | use: eco pay @user amount");

			if (money < amount)
				return message.reply("❌ | Not enough money!");

			const rData = await usersData.get(receiver);

			await usersData.set(uid, { money: money - amount });
			await usersData.set(receiver, {
				money: (rData.money || 0) + amount
			});

			return message.reply(`💸 | Sent ${amount}$`);
		}

		// 🏦 BANK SYSTEM
		if (cmd === "bank") {

			const type = args[1];
			const amount = parseInt(args[2]);

			// deposit
			if (type === "deposit") {
				if (money < amount)
					return message.reply("❌ | Not enough cash!");

				await usersData.set(uid, {
					money: money - amount,
					bank: bank + amount
				});

				return message.reply(`🏦 | Deposited ${amount}$`);
			}

			// withdraw
			if (type === "withdraw") {
				if (bank < amount)
					return message.reply("❌ | Not enough bank money!");

				await usersData.set(uid, {
					money: money + amount,
					bank: bank - amount
				});

				return message.reply(`💵 | Withdraw ${amount}$`);
			}
		}

		// 🏆 RANK
		if (cmd === "rank") {
			const total = money + bank;

			let rank = "🥉 Beginner";
			if (total > 5000) rank = "🥈 Pro";
			if (total > 20000) rank = "🥇 Rich";
			if (total > 50000) rank = "👑 King";

			return message.reply(
`🏆 Rank: ${rank}
💰 Total: ${total}$`
			);
		}

		// ❓ HELP
		return message.reply(
`📌 Use:
eco → balance
eco daily
eco pay @user amount
eco bank deposit amount
eco bank withdraw amount
eco rank`
		);
	}
};
