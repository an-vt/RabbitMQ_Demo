const amqp = require("amqplib");

const runConsumer = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "q1";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // receive message to provider channel
  channel.consume(
    queueName,
    (message) => {
      console.log(`Received message :: ${message.content.toString()}`);
    },
    {
      noAck: true,
    }
  );
};

runConsumer().catch(console.error);
