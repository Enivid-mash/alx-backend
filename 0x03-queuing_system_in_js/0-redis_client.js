import redis from 'redis';

// Create a new Redis client, connecting to the default host (127.0.0.1) and port (6379)
const client = redis.createClient();

// Event listener for successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection errors
client.on('error', (err) => {
  console.error(`Redis client failed to connect: ${err.message}`);
});
