import { SlashCommandBuilder } from "discord.js";
import { CommandStruct } from "../structs/commandStruct.js";
import { Hoyolab } from "../services/check.js";
import { handlePromise } from "../utils/handlePromise.js";
export class Add extends CommandStruct {
    static data = new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add your account, DO NOT SHARE YOUR COOKIE TO ANYONE!!!")
        .addStringOption((option) => option
        .setName("hoyolab_token")
        .setDescription("Input your hoyolab ltoken_v2 cookie from hoyolab")
        .setRequired(true))
        .addStringOption((option) => option.setName("hoyolab_uid").setDescription("Input your hoyolab ltuid_v2 cookie from hoyolab").setRequired(true));
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
        const username = interaction.user.username;
        const discordUserId = interaction.user.id;
        const ltokenV2 = interaction.options.getString("hoyolab_token") || "";
        const ltuidV2 = interaction.options.getString("hoyolab_uid") || "";
        const res = new Hoyolab(this.client).addUser({ username, discordUserId, ltokenV2, ltuidV2 });
        const [promise, error] = await handlePromise(res);
        if (error) {
            await interaction.editReply({
                content: `Failed to add user`,
            });
        }
        await interaction.editReply({
            content: promise.message,
        });
    }
}
