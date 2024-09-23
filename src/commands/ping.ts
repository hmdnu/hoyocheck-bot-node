import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import { CommandStruct } from "../structs/commandStruct.js";

export class Ping extends CommandStruct {
  static data = new SlashCommandBuilder().setName("test").setDescription("test app ok");

  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    await interaction.reply(`ok gas mantap`);
  }
}
