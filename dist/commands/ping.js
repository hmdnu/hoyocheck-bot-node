import { SlashCommandBuilder } from "discord.js";
import { CommandStruct } from "../structs/commandStruct.js";
export class Ping extends CommandStruct {
    static data = new SlashCommandBuilder().setName("test").setDescription("test app ok");
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) {
            return;
        }
        await interaction.reply({ content: `ok gas mantap`, ephemeral: true });
    }
}
