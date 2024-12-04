import redis from 'redis';

// Create a new Redis client
const client = redis.createClient();

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

// Function to retrieve a value from Redis
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, result) => {
    if (err) {
      console.error(`Error getting ${schoolName}: ${err.message}`);
    } else {
      console.log(`${schoolName}: ${result}`);
    }
  });
}

// Test the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
