import { GatewayIntentBits } from "discord.js";
import { ExtendedClient } from "./structs/ExtendedClient.js";
import { Env } from "./utils/constant.js";
const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });
client.login(Env.dcToken);
console.log("hello");
