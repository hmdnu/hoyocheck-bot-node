import { ofetch } from "ofetch";
import { Env, ResponseCode } from "../utils/constant.js";
import { handlePromise } from "../utils/handlePromise.js";
import { EmbedBuilder } from "@discordjs/builders";
export class Hoyolab {
    client;
    constructor(client) {
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
    async checkSingle(dcId) {
        const res = this.fetch(`/check/${dcId}`, { method: "GET" });
        const [promise, error] = await handlePromise(res);
        if (error) {
            console.log(promise);
            throw error;
        }
        return promise;
    }
    async addUser({ username, discordUserId, ltokenV2, ltuidV2 }) {
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
    async checkAll() {
        const res = this.fetch("/checkInAll", { method: "GET" });
        const [promise, error] = await handlePromise(res);
        if (error) {
            console.log(error);
            throw error;
        }
        const users = promise;
        const embed = new EmbedBuilder()
            .setTitle("Daily hoyoverse game check in")
            .setAuthor({
            name: this.client.user?.username || "hoyocheck",
            iconURL: this.client.user?.avatarURL() || "",
        })
            .setTimestamp();
        for (const user of users.data) {
            for (const data of user.data) {
                if (data.retcode === ResponseCode.success ||
                    data.retcode === ResponseCode.alreadyCheckedIn ||
                    data.retcode === ResponseCode.gameNotFound) {
                    embed.addFields({
                        name: data.retcode === ResponseCode.success || data.retcode === ResponseCode.alreadyCheckedIn
                            ? `${user.username} ✅`
                            : `${user.username} ❌`,
                        value: data.retcode === ResponseCode.success || data.retcode === ResponseCode.alreadyCheckedIn
                            ? `Successfully checked in you can check in game mail`
                            : `Failed to checked in`,
                    });
                }
                break;
            }
        }
        const channel = (await this.client.channels.fetch(Env.channelId));
        channel.send({ content: `<@&${Env.roleId}>`, embeds: [embed] });
    }
    async fetch(url, options = {}) {
        return ofetch(url, {
            ...options,
            baseURL: Env.baseUrl,
            headers: {
                Authorization: "Bearer " + Env.apiToken,
            },
        });
    }
}
