const amqp = require("amqplib");

const messages = "Hello from RabbitMQ provider";

const runProducer = async ({ msg }) => {
  try {
    //1. create connection
    const connection = await amqp.connect("amqp://localhost");
    //2. create channel
    const channel = await connection.createChannel();
    //3. create exchange
    const nameExchange = "post";

    await channel.assertExchange(nameExchange, "fanout", {
      durable: true,
    });

    //4. publish post
    await channel.publish(nameExchange, "", Buffer.from(msg));

    console.log(`Sent message :: ${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(error.message);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello from RabbitMQ Publish";
runProducer({ msg });
