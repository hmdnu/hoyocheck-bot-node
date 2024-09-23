import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandStruct } from "../structs/commandStruct.js";
import { Hoyolab } from "../services/check.js";
import { handlePromise } from "../utils/handlePromise.js";
import { ResponseCode } from "../utils/constant.js";
export class Check extends CommandStruct {
    static data = new SlashCommandBuilder().setName("check").setDescription("check if already check in or not");
    client;
    constructor(client) {
        super();
        this.client = client;
    }
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) {
            return;
        }
        await interaction.deferReply({ ephemeral: true });
        const userId = interaction.user.id;
        const hoyolab = new Hoyolab(this.client).checkSingle(userId);
        const [promise, error] = await handlePromise(hoyolab);
        if (error) {
            console.log(error);
            await interaction.editReply({
                content: `sorry there was an error fetching your data, ${error}`,
            });
        }
        const embed = new EmbedBuilder();
        const userData = promise;
        embed
            .setTitle(`${userData.user.username}'s check in information`)
            .setDescription("Your information of hoyolab check in");
        for (const data of userData.data) {
            embed.addFields({
                name: data.retcode === ResponseCode.success || data.retcode === ResponseCode.alreadyCheckedIn
                    ? `${data.game} ✅`
                    : `${data.game} ❌`,
                value: data.message,
            });
        }
        await interaction.editReply({ embeds: [embed] });
    }
}
