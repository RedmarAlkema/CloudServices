const amqp = require('amqplib');
const Target = require('../models/Target');

async function consumeTarget() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchangeName = "TargetExchange";
    const queueName = "target_created"; 

    await channel.assertExchange(exchangeName, "fanout", { durable: true });

    await channel.assertQueue(queueName, { durable: true });

   await channel.bindQueue(queueName, exchangeName, "");

    console.log("📥 Wachten op berichten (fanout)...");

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        const targetData = JSON.parse(content);

        try {
          const newTarget = new Target({
            title: targetData.title,
            location: targetData.location,
            description: targetData.description,
            img: targetData.img
              ? {
                  data: Buffer.from(targetData.img.data, 'base64'),
                  contentType: targetData.img.contentType
                }
              : null,
            radius: targetData.radius,
            deadline: targetData.deadline,
            ownerId: targetData.ownerId
          });

          await newTarget.save();
          console.log("✅ Target opgeslagen in read DB:", newTarget._id);
        } catch (err) {
          console.error("❌ Fout bij opslaan in MongoDB:", err.message);
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("❌ Fout bij verbinden met RabbitMQ:", err.message);
  }
}

module.exports = consumeTarget;