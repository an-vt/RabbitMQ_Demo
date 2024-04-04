const amqp = require("amqplib");

const receiveMail = async () => {
  try {
    // 1. create connection
    const connection = await amqp.connect("amqp://localhost");

    // 2. create channel
    const channel = await connection.createChannel();

    // 3. assert exchange, it will be created if does not exist
    const exchange = "send_mail";
    await channel.assertExchange(exchange, "topic", { durable: false });

    // 4. assert queue, it will be created if does not exist
    const { queue } = await channel.assertQueue("", {
      exclusive: true,
    });

    // 5. bind queue to exchange
    const args = process.argv.slice(2);
    if (!args.length) {
      process.exit(0);
    }

    /*
      * : co nghia la phu hop voi bat ky tu nao
      # : khop voi 1 hoac nhieu tu bat ky 
    */

    console.log(`Waiting for messages in queue: ${queue} with topic: ${args}`);
    args.forEach(async (key) => {
      await channel.bindQueue(queue, exchange, key);
    });

    // 6. consume the message
    await channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(
            `Routing key ::: ${
              msg.fields.routingKey
            } | Received message: ${msg.content.toString()}`
          );
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

receiveMail();
