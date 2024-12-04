import redis from 'redis';

// Create a new Redis client for subscribing to channels
const subscriber = redis.createClient();

// Event listeners for connection and error
subscriber.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

subscriber.on('connect', () => {
  console.log('Redis Client Connected');
});

// Subscribe to the 'holberton school channel'
subscriber.subscribe('holberton school channel');

// Handle incoming messages on the subscribed channel
subscriber.on('message', (channel, message) => {
  if (channel === 'holberton school channel') {
    console.log('Received message:', message);

    // Check for the special "KILL_SERVER" message
    if (message === 'KILL_SERVER') {
      console.log('Received kill signal, unsubscribing and quitting');
      subscriber.unsubscribe();
      subscriber.quit();
    }
  }
});
