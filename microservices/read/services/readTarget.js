const amqp = require('amqplib');
const Target = require('../models/Target');

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

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {

        console.log(msg);
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
          console.log("image: ", newTarget.img);
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