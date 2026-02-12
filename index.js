const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

let attendance = {};

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === "!attendance") {
    const msg = await message.channel.send(
      "📋 **DAILY ATTENDANCE**\n\n🟢 = ONLINE\n🔴 = OFFLINE\n\nReact below to mark your status."
    );

    await msg.react("🟢");
    await msg.react("🔴");
  }

  if (message.content === "!summary") {
    let report = "📊 TODAY REPORT\n\n";

    for (const userId in attendance) {
      report += `<@${userId}> — ${attendance[userId]} mins\n`;
    }

    message.channel.send(report);
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  const now = Date.now();

  if (!attendance[user.id]) attendance[user.id] = 0;

  if (reaction.emoji.name === "🟢") {
    attendance[user.id] = now;
  }

  if (reaction.emoji.name === "🔴") {
    if (attendance[user.id]) {
      const duration = Math.floor((now - attendance[user.id]) / 60000);
      attendance[user.id] = duration;

      const embed = new EmbedBuilder()
        .setTitle("Attendance Update")
        .setDescription(`${user.tag} was online for ${duration} mins`)
        .setColor(0x00ff00);

      reaction.message.channel.send({ embeds: [embed] });
    }
  }
});

client.login(process.env.TOKEN);
