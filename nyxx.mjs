import dotenv from 'dotenv';

// read .env file now so process.env contains FLUXER_BOT_TOKEN
dotenv.config();

import {Client, GatewayDispatchEvents} from '@discordjs/core';
import {REST} from '@discordjs/rest';
import {WebSocketManager} from '@discordjs/ws';
import {GatewayIntentBits} from 'discord.js';

const token = process.env['FLUXER_BOT_TOKEN'];

const rest = new REST({api: 'https://api.fluxer.app', version: '1'}).setToken(token);

const gateway = new WebSocketManager({
  // require guilds, guild messages and content to receive message events
  intents:
    GatewayIntentBits.Guilds |
    GatewayIntentBits.GuildMessages |
    GatewayIntentBits.MessageContent,
  rest,
  token,
  version: '1',
});

const client = new Client({rest, gateway});

client.on(GatewayDispatchEvents.MessageCreate, async ({api, data}) => {
  if (data.author.bot) {
    return;
  }

  if (data.content === '!ping') {
    await api.channels.createMessage(data.channel_id, {
      content: 'pong!',
      message_reference: {message_id: data.id},
    });
  }
});

client.on(GatewayDispatchEvents.Ready, ({data}) => {
  const {username, discriminator} = data.user;
  console.log(`Logged in as @${username}#${discriminator}`);
});

gateway.connect();