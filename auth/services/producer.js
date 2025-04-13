const amqp = require('amqplib');
require('dotenv').config();

class Producer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await connection.createChannel();
  }

  async publishUserEmail(user) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = 'Register_exchange';
    await this.channel.assertExchange(exchangeName, "fanout", { durable: true });

    const messagePayload = {
      email: user.email,
      userId: user._id,
      createdAt: user.createdAt,
    };

    this.channel.publish(
      exchangeName,
      "",
      Buffer.from(JSON.stringify(messagePayload)),
      { persistent: true }
    );

  }
}

module.exports = new Producer();