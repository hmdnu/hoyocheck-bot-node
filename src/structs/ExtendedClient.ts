import { REST, Routes, Client, Collection, type ClientOptions } from "discord.js";
import { Ping } from "../commands/ping.js";
import type { CommandStruct } from "./commandStruct.js";
import { CreateInteractionEvent } from "../events/createEvent.js";
import { Env } from "../utils/constant.js";
import { Add } from "../commands/add.js";
import { Hoyolab } from "../services/check.js";
import { Check } from "../commands/check.js";
import { Help } from "../commands/help.js";

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandStruct>;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection([
      [Ping.data.name, new Ping()],
      [Check.data.name, new Check(this)],
      [Add.data.name, new Add(this)],
      [Help.data.name, new Help()],
    ]);

    this.loadEvents();
  }

  loadEvents() {
    this.on("ready", async () => {
      console.log("bot is running");

      this.deployCommands();

      await new Hoyolab(this).beginCheckAll();
    });

    this.on("interactionCreate", (interaction) => new CreateInteractionEvent(this).execute(interaction));
  }

  async deployCommands() {
    const rest = new REST().setToken(Env.dcToken!);

    const commands = [Ping.data.toJSON(), Check.data.toJSON(), Add.data.toJSON(), Help.data.toJSON()];

    await rest
      .put(Routes.applicationCommands(Env.clientId!), { body: commands })
      .then(() => console.log("commands registered " + commands.length))
      .catch((error) => console.log(error));
  }
}
