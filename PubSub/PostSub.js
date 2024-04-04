const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    // 1. create connection
    const connection = await amqp.connect("amqp://localhost");

    // 2. create channel
    const channel = await connection.createChannel();

    // 3. assert exchange, it will be created if does not exist
    const exchange = "post";
    await channel.assertExchange(exchange, "fanout", { durable: true });

    // 4. assert queue, it will be created if does not exist
    const queue = await channel.assertQueue("", {
      exclusive: true,
    });

    console.log(`Waiting for messages in queue: ${queue.queue}`);

    // 5. bind queue to exchange
    await channel.bindQueue(queue.queue, exchange);

    // 6. consume the message
    channel.consume(
      queue.queue,
      (msg) => {
        if (msg !== null) {
          console.log(`Received message: ${msg.content.toString()}`);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error(`Error from consumer: ${error.message}`);
  }
};

runConsumer();
