const amqp = require('amqplib');
const config = require('../routes/config');

class Producer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey, target) {
    if (!this.channel) {
      await this.createChannel();
    }

    if (typeof target.then === 'function') {
        target = await target;
    }

    const exchangeName = config.rabbitMQ.exchangeName;
    await this.channel.assertExchange(exchangeName, "direct", { durable: true });

    const imgData = target.img?.data 
      ? target.img.data.toString('base64') 
      : null;

    const messagePayload = {
      title: target.title,
      location: target.location,
      description: target.description,
      radius: target.radius,
      deadline: target.deadline,
      ownerId: target.ownerId,
      img: imgData 
        ? {
            data: imgData,
            contentType: target.img.contentType
          }
        : null
    };

    this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(messagePayload))
    );

    console.log("target: ", target);
    console.log("message payload: ", messagePayload);
    console.log(`✅ Bericht verzonden naar exchange "${exchangeName}" met routingKey "${routingKey}"`);
  }
}

module.exports = new Producer();