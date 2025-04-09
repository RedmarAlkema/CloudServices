const amqp = require('amqplib');

let channel;

async function connect() {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue('target_created');
}

async function publishTargetCreated(target) {
  if (!channel) await connect();
  channel.sendToQueue('target_created', Buffer.from(JSON.stringify(target)));
}

module.exports = { publishTargetCreated };