export const integrations: {
	[key: string]: {
        name: string
        settings:  {[key: string]: string}
        description: string
    }
} = {
	tg: {
        name: 'Telegram',
        settings: {
            token: '',
        },
        description: 'Telegram bot integration',
    },
    wa: {
        name: 'WhatsApp',
        settings: {
            users: '',
        },
        description: 'WhatsApp bot integration',
    }
}
