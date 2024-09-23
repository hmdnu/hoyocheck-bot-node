import type { ClientEvents } from "discord.js";
import type { ExtendedClient } from "./ExtendedClient.js";

export abstract class EventStruct {
  protected readonly client: ExtendedClient;

  protected constructor(client: ExtendedClient) {
    this.client = client;
  }

  protected abstract execute(...args: ClientEvents[keyof ClientEvents]): void | Promise<void>;
}
