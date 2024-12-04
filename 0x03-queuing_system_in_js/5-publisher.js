import redis from 'redis';

// Create a new Redis client
const client = redis.createClient();

// Event listeners for connection and error
client.on('error', (err) => {
  console.error(`Redis Client Error: ${err.message}`);
});

client.on('connect', () => {
  console.log('Redis Client Connected');
});

// Define a key to store multiple fields
const KEY = 'HolbertonSchools';

// Array of school names and their respective values
const keys = ['Portland', 'Seattle', 'New York', 'Bogota', 'Cali', 'Paris'];
const values = [50, 80, 20, 20, 40, 2];

// Iterate over the keys and values, setting each key-value pair in the hash
keys.forEach((key, index) => {
  client.hSet(KEY, key, values[index], (err, reply) => {
    if (err) {
      console.error(`Error setting ${key}: ${err.message}`);
    } else {
      console.log(`${key} set to ${values[index]}`);
    }
  });
});

// Retrieve all fields and values from the hash
client.hGetAll(KEY, (err, values) => {
  if (err) {
    console.error('Error fetching values:', err);
  } else {
    console.log('All values:', values);
  }
});
