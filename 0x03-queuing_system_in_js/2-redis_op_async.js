import redis from 'redis';
import { promisify } from 'util';

// Create a new Redis client
const client = redis.createClient();

// Promisify the `get` command for asynchronous operations
const asyncGet = promisify(client.get).bind(client);

// Event listeners for connection and error
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error(`Redis client failed to connect: ${err.message}`);
});

// Function to set a new key-value pair in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting ${schoolName}: ${err.message}`);
    } else {
      console.log(`Set ${schoolName} to ${value}`);
    }
  });
}

// Asynchronous function to retrieve a value from Redis
async function displaySchoolValue(schoolName) {
  try {
    const value = await asyncGet(schoolName);
    console.log(`${schoolName}: ${value}`);
  } catch (err) {
    console.error(`Error getting ${schoolName}: ${err.message}`);
  }
}

// Test the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
