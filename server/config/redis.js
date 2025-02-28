import { createClient } from 'redis';

// Function to connect to Redis
const connectRedis = async () => {
  const client = createClient({
    username: 'default',
    password: 'PD95HzOrnUPHglaKOOHjUELrrgz8Y3ar',
    socket: {
      host: 'redis-19104.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
      port: 19104,
    },
  });

  // Error handling for Redis client
  client.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  try {
    await client.connect();
    console.log("Redis Connection Successful");
  } catch (err) {
    console.error("Redis Connection Unsuccessful", err.message);
    process.exit(1); // Exit the process if DB connection fails
  }

  // Optional: Return the client for use in other parts of your application
  return client;
};

export default connectRedis;
