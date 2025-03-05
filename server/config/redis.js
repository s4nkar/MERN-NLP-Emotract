import { createClient } from 'redis';

// Function to connect to Redis
const connectRedis = async () => {
  const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD, 
    socket: {
      host: process.env.REDIS_HOST, 
      port: process.env.REDIS_PORT,
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
