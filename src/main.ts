// @ts-ignore
import fetch from "node-fetch";

export class Interaction {
    readonly bot_id: string;
    readonly endpoints: { MESSAGES: string; CALLBACK: string; FOLLOWUP: string };
    packet: SlashMessageInteraction;
    followup: (content: Object, thread_id: string | null) => Promise<Object>;
    edit_followup: (content: Object, message_id: string) => Promise<Object>;
    delete_followup: (message_id: string) => Promise<Object>;
    callback: (content: Object) => Promise<Object>;
    defer: () => Promise<Object>;
    thinking: () => Promise<Object>;
    constructor(data: rawInteraction, bot_id: string) {
        this.bot_id = bot_id;
        this.endpoints = {
            CALLBACK: `https://discord.com/api/v9/interactions/${data.id}/${data.token}/callback`,
            MESSAGES: `https://discord.com/api/v9/webhooks/${this.bot_id}/${data.token}/messages/@original`,
            FOLLOWUP: `https://discord.com/api/v9/webhooks/${this.bot_id}/${data.token}`
        };
        this.packet = new SlashMessageInteraction(data)
        this.followup = (content: Object, thread_id = null) => {
            return new Promise((resolve, reject) => {
                fetch(this.endpoints.FOLLOWUP + '?wait=true' + `${thread_id ? `&thread_id=${thread_id}`: ''}`, {
                    method: "POST",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type':"application/json",
                    }
                }).then(async (res: Response) => {
                    resolve(verifyRes(res, 200));
                })
            })
        }
        this.edit_followup = (content: Object, message_id: string) => {
            return new Promise((resolve, reject) => {
                fetch(this.endpoints.FOLLOWUP + '/messages/' + message_id, {
                    method: "PATCH",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type':"application/json",
                    }
                }).then(async (res: Response) => {
                    resolve(verifyRes(res, 200));
                })
            })
        }
        this.delete_followup = (message_id: string) => {
            return new Promise((resolve, reject) => {
                fetch(this.endpoints.FOLLOWUP + '/messages/' + message_id, {
                    method: "DELETE",
                    headers: {
                        'Content-Type':"application/json",
                    }
                }).then(async (res: Response) => {
                    resolve(verifyRes(res, 204));
                })
            })
        }
        this.callback = (content: Object) => {
            return new Promise((resolve) => {
                fetch(this.endpoints.CALLBACK, {
                    method: "POST",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type':"application/json",
                    }
                }).then(async (res: Response) => {
                    resolve(verifyRes(res, 204));
                })
            })
        }
        this.defer = () => {
            return new Promise(async resolve => {
                resolve(await this.callback({type: 6}));
            })

        }
        this.thinking = () => {
            return new Promise(async resolve => {
                resolve(await this.callback({type: 5}));
            })
        }
        return this
    }
}

class SlashMessageInteraction {
    constructor(data: {
        id: string,
        token: string,
        version: number,
        type: number,
        member: {
            user: Object
        },
        guild_id: string,
        channel_id: string,
        data: {
            id: string,
            options: any[],
            name: string
        }
    }) {
        return {
            version: data.version,
            type: data.type,
            member: data.member,
            user: data.member.user,
            interaction: {
                id: data.id,
                token: data.token,
                guild_id: data.guild_id,
                channel_id: data.channel_id,
            },
            command: {
                id: data.data.id,
                options: data.data.options,
                name: data.data.name,
                guild_id: data.guild_id,
                channel_id: data.channel_id,
            }
        }
    }
}
interface rawInteraction {
    id: string,
    token: string,
    version: number,
    type: number,
    member: {
        user: Object
    },
    guild_id: string,
    channel_id: string,
    data: {
        id: string,
        options: any[],
        name: string
    }
}

const verifyRes = (res: Response, expected_code: number) => {
        if(res.status === expected_code) {
            try {
                return res?.json() || {}
            } catch(e) {
                return {}
            }
        } else {
            console.error("Warning Unexpected Status Code!")
            console.error(res.status)
            try {
                return {status: res.status, body: res?.json() || {}}
            } catch(e) {
                return {status: res.status, body:{}}
            }
        }
}

export const ApplicationCommandOptionType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8
}
export const ButtonType = {
    type: {
        ROW: 1,
        BUTTON: 2,
        MENU: 3
    },
    style: {
        PRIMARY: 1,
        SECONDARY: 2,
        SUCCESS: 3,
        DANGER: 4,
        LINK: 5
    }
}