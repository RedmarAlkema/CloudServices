const Clock = require("../models/Clock");
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const amqp = require('amqplib');
const config = require('../routes/config');

class Producer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(targetId) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = 'clock_exchange'; 

    await this.channel.assertExchange(exchangeName, "fanout", { durable: true });

    const messagePayload = { targetId };

    this.channel.publish(
      exchangeName,
      "", 
      Buffer.from(JSON.stringify(messagePayload)),
      { persistent: true }
    );

    console.log("message payload: ", messagePayload);
    console.log(`✅ Bericht verzonden naar fanout exchange "${exchangeName}"`);
  }
}

const producer = new Producer();

async function checkAndDeleteExpiredTargets() {
  try {
    console.log("looking...");
    const clocks = await Clock.find();

    const currentTime = moment.tz('Europe/Amsterdam').toISOString();

    for (const clock of clocks) {
      const clockDeadline = moment.utc(clock.deadline).toISOString();

      console.log('compare:', clockDeadline, currentTime);

      if (clockDeadline <= currentTime) {
        console.log(`❌ Deadline passed for target ${clock.targetId}. Sending to RabbitMQ...`);
        
        await producer.publishMessage(clock.targetId); 
        
        console.log(`❌ Deleting target ${clock.targetId}...`);
        await Clock.findByIdAndDelete(clock._id);

        console.log(`✅ Target ${clock._id} deleted.`);
      }
    }
  } catch (err) {
    console.error("❌ Error while checking targets:", err.message);
  }
}

setInterval(checkAndDeleteExpiredTargets, 5000);

module.exports = checkAndDeleteExpiredTargets;