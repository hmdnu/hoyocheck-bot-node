import { EmbedBuilder, SlashCommandBuilder, type CommandInteraction } from "discord.js";
import { CommandStruct } from "../structs/commandStruct.js";

export class Help extends CommandStruct {
  static data = new SlashCommandBuilder().setName("help").setDescription("Display how to use this bot");

  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const embedGuide = new EmbedBuilder()
      .setTitle("Guide to add your account to the bot")
      .setFields({ name: "Follow this link", value: "https://gist.github.com/hmdnu/0ccd2cfdb556592efa13b5f7bb2aefe7" });

    // const embedCommand = new EmbedBuilder().setTitle("List of commands").setFields({})

    await interaction.reply({
      content: "Here is your guide please follow carefully, if you need question just ask :D",
      ephemeral: true,
      embeds: [embedGuide],
    });
  }
}
