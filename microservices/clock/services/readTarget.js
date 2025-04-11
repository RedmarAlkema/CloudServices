const amqp = require('amqplib');
const Clock = require('../models/clock');

async function consumeTarget() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchangeName = "TargetExchange";
        const routingKey = "Info";
        const queueName = "target_created";

        await channel.assertExchange(exchangeName, "direct", { durable: true });
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, exchangeName, routingKey);

        console.log("📥 Wachten op berichten...");


        try {
            const newClock = new Clock({
                id: targetData.id,
                deadline: targetData.deadline,
            });

            await newClock.save();
            console.log("✅ Clock opgeslagen in read DB:", newClock._id);
        } catch (err) {
            console.error("❌ Fout bij opslaan in MongoDB:", err.message);
        }

        channel.ack(msg);


    } catch (err) {
        console.error("❌ Fout bij verbinden met RabbitMQ:", err.message);
    }
}

module.exports = consumeTarget;