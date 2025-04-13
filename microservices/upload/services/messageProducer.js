const amqp = require('amqplib');
const config = require('../routes/config');

class Producer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(upload) {
    if (!this.upload) {
      await this.createChannel();
    }

    if (typeof upload.then === 'function') {
        upload = await upload;
    }

    const exchangeName = config.rabbitMQ.exchangeName;

    await this.channel.assertExchange(exchangeName, "fanout", { durable: true });

    const imgData = upload.img?.data 
      ? upload.img.data.toString('base64') 
      : null;

    const messagePayload = {
      uploadId: upload.uploadId,
      filename: upload.filename,
      userId: upload.userId,
      targetId: upload.targetId,
      contentType: upload.contentType,
      uploadDate: upload.uploadDate,
      img: imgData 
        ? {
            data: imgData,
            contentType: upload.img.contentType
          }
        : null
    };

    this.channel.publish(
      exchangeName,
      "", 
      Buffer.from(JSON.stringify(messagePayload)),
      { persistent: true }
    );

    console.log("upload: ", upload);
    console.log("message payload: ", messagePayload);
    console.log(`✅ Bericht verzonden naar fanout exchange "${exchangeName}"`);
  }
}

module.exports = new Producer();