const amqp = require("amqplib");

const messages = "Hello from RabbitMQ provider";

const runProducer = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "q1";
  await channel.assertQueue(queueName, {
    durable: true, //save queue when restart server or sever crash
  });

  // send message to consumer channel
  channel.sendToQueue(queueName, Buffer.from(messages), {
    // expiration: "7000", // TTL Time to live
    persistent: true, // save queue in cache, if doesn't in cache => find in memory
  });
  setTimeout(() => {
    connection.close();
  }, 0);
};

runProducer().catch(console.error);
