const webSocket = require('ws');
const events = require('events');
require('dotenv').config();

const emitter = new events.EventEmitter();
const initGatewayUrl = 'wss://gateway.discord.gg';
let resumeGatewayUrl = initGatewayUrl;
let sessionID = '';
let ws;
let interval = 0;
let seq = null;
// Payload for identify
const payload = {
    op: 2,
    d: {
        token: process.env.TOKEN,
        properties: {
            os: 'linux',
            browser: 'chrome',
            device: 'chrome',
        }
    }
}

const heartbeat = (ms) => {
    return setInterval(() => {
        ws.send(JSON.stringify({
            op: 1,
            d: seq,
        }));
    }, ms)
};

const initWebsocket = () => {
    if (ws && ws.readyState === 3) {
        ws.close();
    }
    let wasReady = false;

    // If you have not previously connected to the gateway, connect to the init gateway,
    // otherwise connect to the resume gateway
    ws = new webSocket(resumeGatewayUrl + '/v=10&encoding=json');
    ws.on('open', () => {
        if (resumeGatewayUrl !== initGatewayUrl) { // If you have previously connected to the gateway, try to resume
            const resumePayload = {
                op: 6,
                d: {
                    token: process.env.TOKEN,
                    session_id: sessionID,
                    seq: seq,
                }
            };
            ws.send(JSON.stringify(resumePayload));
        }
    });

    ws.on('error', (err) => {
        console.log(err);
    });

    // If the connection is closed, try to reconnect
    ws.on('close', (code, reason) => {
        if (wasReady) { // If the connection was ready, try to resume
            console.log(`Websocket closed with code ${code} and reason ${reason}`);
            clearInterval(interval); // Clear heartbeat interval
            setTimeout(() => {
                initWebsocket(); // Reconnect
            }, 2500);
        }
    });

    ws.on('message', (data) => {
        const p = JSON.parse(data);
        const { t, op, d, s } = p;
        const res = {
            data: d,
            type: t,
        };
        switch (op) {
            case 10:
                const { heartbeat_interval } = d; // Get heartbeat interval
                interval = heartbeat(heartbeat_interval); // Start heartbeat
                wasReady = true; // Set ready flag

                if (resumeGatewayUrl === initGatewayUrl) ws.send(JSON.stringify(payload)); // Identify
                break;
            case 0:
                seq = s;
                break;
        }

        switch (t) {
            case 'READY':
                console.log(`Logged in as ${d.user.username}#${d.user.discriminator}`);
                resumeGatewayUrl = d.resume_gateway_url;
                sessionID = d.session_id;
                emitter.emit('userReady', res);
                break;

            case 'RESUMED':
                console.log('Gateway connection resumed!');
                break;
            case 'MESSAGE_CREATE':
                emitter.emit('messageRecieved', res);
                break;
            case 'MESSAGE_UPDATE':
                emitter.emit('messageUpdated', res);
                break;
            case 'MESSAGE_DELETE':
                emitter.emit('messageDeleted', res);
                break;
        }
    });
};

exports.initWebsocket = initWebsocket;
exports.emitter = emitter;
