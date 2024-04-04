const amqp = require("amqplib");

const sendMail = async () => {
  try {
    //1. create connection
    const connection = await amqp.connect("amqp://localhost");
    //2. create channel
    const channel = await connection.createChannel();
    //3. create exchange
    const nameExchange = "send_mail";

    await channel.assertExchange(nameExchange, "topic", {
      durable: false,
    });

    const args = process.argv.slice(2);
    const msg = args[1] || "Fixed!";
    const topic = args[0];

    console.log(`msg::${msg} topic::${topic}`);

    //4. publish mail
    await channel.publish(nameExchange, topic, Buffer.from(msg));

    console.log(`Sent mail :: ${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(error.message);
  }
};

sendMail();
