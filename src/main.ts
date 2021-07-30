// @ts-ignore
import fetch from "node-fetch";

export class Interaction {
    readonly bot_id: string;
    readonly endpoints: { MESSAGES: string; CALLBACK: string; FOLLOWUP: string };
    // @ts-ignore
    packet: SlashMessageInteraction | ButtonMessageInteraction;
    followup: (content: Object, thread_id: string | null) => Promise<Object>;
    edit_followup: (content: Object, message_id: string) => Promise<Object>;
    delete_followup: (message_id: string) => Promise<Object>;
    callback: (content: Object) => Promise<Object>;
    defer: () => Promise<Object>;
    thinking: () => Promise<Object>;
    private readonly bot_token: string;
    constructor(data: rawInteraction | rawButtonInteraction, bot_id: string, token:string) {
        this.bot_token = token
        this.bot_id = bot_id;
        this.endpoints = {
            CALLBACK: `https://discord.com/api/v9/interactions/${data.id}/${data.token}/callback`,
            MESSAGES: `https://discord.com/api/v8/webhooks/${data.application_id}/${data.token}/messages/@original`,
            FOLLOWUP: `https://discord.com/api/v8/webhooks/${data.application_id}/${data.token}/`
        };
        if(data.type === 2) {
            // @ts-ignore
            this.packet = new SlashMessageInteraction(data)
        } else if(data.type === 3) {
            // @ts-ignore
            this.packet = new ButtonMessageInteraction(data)
        }
        this.followup = (content: Object, thread_id = null) => {
            return new Promise((resolve, reject) => {
                fetch(this.endpoints.FOLLOWUP, {
                    method: "POST",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type':"application/json",
                        'Authorization': `Bot ${this.bot_token}`
                    }
                }).then(async (res: Response) => {
                    resolve(await verifyRes(res, 200));
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
                        'Authorization': `Bot ${this.bot_token}`
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
                        'Authorization': `Bot ${this.bot_token}`
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
                    resolve(res || null);
                }).catch(() => {})
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
    constructor(data: rawInteraction) {
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
            },
            timestamp: Date.now()
        }
    }
}
class ButtonMessageInteraction {
    constructor(data:rawButtonInteraction) {
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
            message: data.message,
            command: {
                id: data.data.custom_id,
                type: data.data.component_type,
                values: data.data.values || [],
                guild_id: data.guild_id,
                channel_id: data.channel_id,
                _raw: data.data
            },
            timestamp: Date.now()
        }
    }
}
interface rawInteraction {
    id: string,
    token: string,
    version: number,
    type: number,
    application_id: string,
    member: {
        user: Object
    },
    guild_id: string,
    channel_id: string,
    data: {
        id: string,
        options: any[],
        name: string,
    }
}
interface rawButtonInteraction {
    id: string,
    token: string,
    version: number,
    type: number,
    application_id: string,
    member: {
        user: Object
    },
    message: Object,
    guild_id: string,
    channel_id: string,
    data: {
        custom_id: string,
        component_type: number,
        values?: string[]
    }
}

const verifyRes = async(res: Response, expected_code: number) => {
        if(res.status === expected_code) {
            try {
                return await res?.json() || {}
            } catch(e) {
                return {}
            }
        } else {
            console.error("Warning Unexpected Status Code!")
            console.error(res.status)
            try {
                return {status: res.status, body: await res?.json() || {}}
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