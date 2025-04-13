const amqp = require('amqplib');
const Upload = require('../models/Upload');

async function consumeUpload() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchangeName = "UploadExchange";
    const queueName = "upload_created"; 

    await channel.assertExchange(exchangeName, "fanout", { durable: true });

    await channel.assertQueue(queueName, { durable: true });

   await channel.bindQueue(queueName, exchangeName, "");

    console.log("📥 Wachten op berichten (fanout)...");

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        const uploadData = JSON.parse(content);

        try {
          const newUpload = new Upload({
            uploadId: uploadData.uploadId,
            filename: uploadData.filename,
            img: uploadData.img
              ? {
                  data: Buffer.from(uploadData.img.data, 'base64'),
                  contentType: uploadData.img.contentType
                }
              : null,
            contentType: uploadData.contentType,
            uploadDate: uploadData.uploadDate,
            targetId: uploadData.targetId,
            userId: uploadData.userId
          });

          await newUpload.save();
          console.log("✅ Upload opgeslagen in read DB:", newUpload._id);
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

module.exports = consumeUpload;