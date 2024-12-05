import express from 'express';
import redis from 'redis';
import { promisify } from 'util'; // Using promisify from util instead of deprecated `util`
import kue from 'kue';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err) => {
  console.error(`Redis client error: ${err.message}`);
});

async function reserveSeat(number) {
  const setAsync = promisify(client.set).bind(client);
  return setAsync('available_seats', number);
}

// Initial seat reservation (optional, can be removed)
reserveSeat(50);

let reservationEnabled = true;
const queue = kue.createQueue();

async function getCurrentAvailableSeats() {
  const getAsync = promisify(client.get).bind(client);
  const seats = await getAsync('available_seats');
  return parseInt(seats, 10) || 0; // Parse to integer, default to 0 if not found
}

const app = express();

app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats }).end();
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' }).end();
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      console.error(`Error creating reserve seat job: ${err.message}`);
      return res.json({ status: 'Reservation failed' }).end();
    }

    console.log(`Seat reservation job ${job.id} created`);
  });

  // No explicit event listener needed here, job processing happens in '/process'
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' }).end();

  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = await getCurrentAvailableSeats();
    if (currentSeats === 0) {
      reservationEnabled = false;
      done();
    } else if (currentSeats > 0) {
      await reserveSeat(currentSeats - 1); // Use await for asynchronous reserveSeat
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

app.listen(1245);
