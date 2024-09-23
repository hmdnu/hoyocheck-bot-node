import { type Interaction } from "discord.js";
import { EventStruct } from "../structs/eventStruct.js";
import type { ExtendedClient } from "../structs/ExtendedClient.js";

export class CreateInteractionEvent extends EventStruct {
  constructor(client: ExtendedClient) {
    super(client);
  }

  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const commands = this.client.commands.get(interaction.commandName);

    if (!commands) {
      return;
    }

    try {
      await commands.execute(interaction);
    } catch (err) {
      await interaction.reply({
        content: "there was an error while executing this command",
        ephemeral: true,
      });
    }
  }
}
