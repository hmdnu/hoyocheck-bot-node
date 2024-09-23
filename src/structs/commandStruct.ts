import type {
  CommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export abstract class CommandStruct {
  static data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

  abstract execute(interaction: CommandInteraction): void | Promise<void | InteractionResponse<boolean>>;
}
