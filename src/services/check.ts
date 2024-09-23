import { ofetch, type FetchOptions } from "ofetch";
import { Env, ResponseCode } from "../utils/constant.js";
import { handlePromise } from "../utils/handlePromise.js";
import { TResultData, TUser } from "../types/index.js";
import type { TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import type { ExtendedClient } from "../structs/ExtendedClient.js";

export class Hoyolab {
  private client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  async beginCheckAll() {
    const now = new Date();
    const nextRun = new Date();

    nextRun.setHours(7, 0, 0, 0);

    if (now > nextRun) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const timeUntilNextRun = nextRun.getTime() - now.getTime();
    const interval = 1000 * 60 * 60 * 24;

    this.checkAll();

    setTimeout(() => {
      this.checkAll();

      setInterval(() => this.checkAll(), interval);
    }, timeUntilNextRun);
  }

  async checkSingle(dcId: string) {
    const res = this.fetch(`/check/${dcId}`, { method: "GET" });

    const [promise, error] = await handlePromise(res);

    if (error) {
      console.log(promise);
      throw error;
    }

    return promise;
  }

  async addUser({ username, discordUserId, ltokenV2, ltuidV2 }: TUser) {
    const res = this.fetch("/add", {
      method: "POST",
      body: {
        username,
        discordUserId,
        ltokenV2,
        ltuidV2,
      },
    });

    const [promise, error] = await handlePromise(res);

    if (error) {
      throw error;
    }

    return promise;
  }

  private async checkAll() {
    const res = this.fetch("/checkInAll", { method: "GET" });

    const [promise, error] = await handlePromise(res);

    if (error) {
      console.log(error);
      throw error;
    }

    const users = promise as { data: TResultData[] };

    const embed = new EmbedBuilder()
      .setTitle("Daily hoyoverse game check in")
      .setAuthor({
        name: this.client.user?.username || "hoyocheck",
        iconURL: this.client.user?.avatarURL() || "",
      })
      .setTimestamp();

    for (const user of users.data) {
      for (const data of user.data) {
        if (
          data.retcode === ResponseCode.success ||
          data.retcode === ResponseCode.alreadyCheckedIn ||
          data.retcode === ResponseCode.gameNotFound
        ) {
          embed.addFields({
            name:
              data.retcode === ResponseCode.success || data.retcode === ResponseCode.alreadyCheckedIn
                ? `${user.username} ✅`
                : `${user.username} ❌`,
            value:
              data.retcode === ResponseCode.success || data.retcode === ResponseCode.alreadyCheckedIn
                ? `Successfully checked in you can check in game mail`
                : `Failed to checked in`,
          });
        }
        break;
      }
    }

    const channel = (await this.client.channels.fetch(Env.channelId!)) as TextChannel;
    channel.send({ content: `<@&${Env.roleId}>`, embeds: [embed] });
  }

  private async fetch(url: string, options: FetchOptions = {}) {
    return ofetch(url, {
      ...options,
      baseURL: Env.baseUrl,
      headers: {
        Authorization: "Bearer " + Env.apiToken,
      },
    });
  }
}
