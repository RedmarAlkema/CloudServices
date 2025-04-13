const amqp = require('amqplib');
const Target = require('../models/Target');
const axios = require('axios');
const { getWinner } = require('../controllers/scoreController');

class GetDeadline {
  channel;

  async createChannel() {
    const connection = await amqp.connect("amqp://localhost");
    this.channel = await connection.createChannel();
  }

  async consumeMessage() {
    try {
      const exchangeName = "clock_exchange";
      const queueName = "clock_queue";

      await this.channel.assertExchange(exchangeName, "fanout", { durable: true });
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, exchangeName, "");

      console.log("📥 Waiting for messages from clock_exchange...");

      this.channel.consume(queueName, async (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          const clockData = JSON.parse(content);
          const targetId = clockData.targetId;

          try {
            console.log(`Received targetId: ${targetId}`);
            
            // Simulate req object to match getWinner's expected parameter structure
            const simulatedReq = { params: { targetId } };
            const winner = await this.getWinner(simulatedReq); // Pass simulated req with targetId
            console.log(`Winner for target ${targetId}:`, winner);

            // Acknowledge the message after processing
            this.channel.ack(msg);
          } catch (err) {
            console.error(`❌ Error processing message for targetId ${targetId}:`, err.message);
          }
        }
      });
    } catch (err) {
      console.error("❌ Error while consuming messages from RabbitMQ:", err.message);
    }
  }

  async getWinner(req) {
    try {
      // Now that we are passing the req object correctly, the targetId can be accessed from req.params
      const targetId = req.params.targetId;
      const winner = await getWinner(targetId); 
      return winner;
    } catch (err) {
      throw new Error(`Failed to fetch winner for targetId ${req.params.targetId}: ${err.message}`);
    }
  }

  async start() {
    await this.createChannel();
    await this.consumeMessage();
  }
}

module.exports = new GetDeadline();