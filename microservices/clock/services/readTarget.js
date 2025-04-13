const amqp = require('amqplib');
const Clock = require('../models/clock');

async function consumeTarget() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchangeName = "TargetExchange";
        const queueName = "target_clock_queue";

        await channel.assertExchange(exchangeName, "fanout", { durable: true }); 
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, exchangeName, '');

        console.log("📥 Wachten op berichten...");

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                try {
                    const targetData = JSON.parse(msg.content.toString());
                    console.log("data: ", targetData);
                    const newClock = new Clock({
                        targetId: targetData.targetId,
                        deadline: targetData.deadline,
                    });

                    await newClock.save();
                    console.log("✅ Clock opgeslagen:", newClock._id);

                    channel.ack(msg);
                } catch (err) {
                    console.error("❌ Fout bij verwerken bericht:", err.message);
                    channel.nack(msg);
                }
            }
        });
    } catch (err) {
        console.error("❌ Fout bij RabbitMQ:", err.message);
    }
}

module.exports = consumeTarget;