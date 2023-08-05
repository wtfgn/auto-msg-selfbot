const express = require('express');
const cors = require('cors');
const axios = require('axios');
const gateway = require('./gateway.cjs');
const webSocket = require('ws');
const events = require('events');
const emitterGateway = gateway.emitter;
require('dotenv').config();

const app = express();
const port = 3000;
const baseUrl = 'https://discord.com/api/v9';

let userData = null;

app.use(cors()); // for CORS
app.use(express.json()); // for parsing application/json
app.use(express.static('dist')) // for serving the HTML file

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/sendMsgToChannel', async (req, res) => {
	let message_reference = null;
	if (req.body.replyingTo !== null) {
			message_reference = {
			message_id: req.body.replyingTo.id,
			channel_id: req.body.replyingTo.channel_id,
			guild_id: req.body.guildID
		};
	}
	try {
		await axios({
			method: 'post',
			url: `${baseUrl}/channels/${req.body.channelID}/messages`,
			headers: {
				'Authorization': `${process.env.BOT_TOKEN}`,
			},
			data: {
				content: req.body.content,
				message_reference: message_reference
			}
		})
		res.send('Message sent!');
	} catch (error) {
		console.log(error);
	}
});

app.post('/editMsg', async (req, res) => {
	try {
		await axios({
			method: 'patch',
			url: `${baseUrl}/channels/${req.body.channelID}/messages/${req.body.msgID}`,
			headers: {
				'Authorization': `${process.env.BOT_TOKEN}`,
			},
			data: {
				content: req.body.content,
			}
		})
		res.send('Message edited!');
	} catch (error) {
		console.log(error);
	}
});

app.get('/getGuilds', async (req, res) => {
	try {
		const response = await axios({
			method: 'get',
			url: `${baseUrl}/users/@me/guilds`,
			headers: {
				'Authorization': `${process.env.BOT_TOKEN}`,
			},
		});
		res.send(response.data);
	} catch (error) {
		console.log(error);
	}
});

app.post('/getChannels', async (req, res) => {
	try {
		const response = await axios({
			method: 'get',
			url: `${baseUrl}/guilds/${req.body.guildID}/channels`,
			headers: {
				'Authorization': `${process.env.BOT_TOKEN}`,
			},
		});
		res.send(response.data);
	}
	catch (err) {
		console.log(err);
	}
});

app.post('/getRoles', async (req, res) => {
	try {
		const response = await axios({
			method: 'get',
			url: `${baseUrl}/guilds/${req.body.guildID}/roles`,
			headers: {
				'Authorization': `${process.env.BOT_TOKEN}`,
			},
		});
		res.send(response.data);
	}
	catch (err) {
		console.log(err);
	}
});

app.post('/getEmojis', async (req, res) => {
	try {
		const response = await axios({
			method: 'get',
			url: `${baseUrl}/guilds/${req.body.guildID}/emojis`,
			headers: {
				'Authorization': `${process.env.BOT_TOKEN}`,
			},
		});
		res.send(response.data);
	}
	catch (err) {
		console.log(err);
	}
});

app.post('/getMsgHistory', async (req, res) => {
	try {
		const response = await axios({
			method: 'get',
			url: `${baseUrl}/channels/${req.body.channelID}/messages`,
			headers: {
				'Authorization': `${process.env.BOT_TOKEN}`,
			},
		});
		res.send(response.data);
	}
	catch (err) {
		console.log(err);
	}
});


const wss = new webSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
	ws.send(JSON.stringify(userData));
	console.log('Client connected');

	ws.on('message', (msg) => {
		console.log(`Message recieved: ${msg}`);
	});
	ws.on('close', () => {
		console.log('Client disconnected');
	});
	emitterGateway.on('messageRecieved', (msgData) => {
		// const { author, content, channel_id, guild_id } = msgData;
		// console.log(`Author: ${author.username}#${author.discriminator}`);
		// console.log(`Content: ${content}`);
		// console.log(`Channel ID: ${channel_id}`);
		// console.log(`Guild ID: ${guild_id}`);
		// console.log(JSON.stringify(msgData));
		// console.log('-------------------');
		ws.send(JSON.stringify(msgData));
	});
	emitterGateway.on('messageUpdated', (msgData) => {
		ws.send(JSON.stringify(msgData));
	});
	emitterGateway.on('messageDeleted', (msgData) => {
		ws.send(JSON.stringify(msgData));
	});
	emitterGateway.on('messageReactionAdded', (msgData) => {
		ws.send(JSON.stringify(msgData));
	});
	emitterGateway.on('messageReactionRemoved', (msgData) => {
		ws.send(JSON.stringify(msgData));
	});
});

emitterGateway.on('userReady', (data) => {
	userData = data;
});

gateway.initWebsocket(); // Load the gateway (get the messages)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
