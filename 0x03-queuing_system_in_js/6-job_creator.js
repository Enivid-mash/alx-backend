const kue = require('kue');

// Create a Kue queue instance
const queue = kue.createQueue();

// Define the job data object
const jobObj = {
  phoneNumber: '4153518780',
  message: 'This is the code to verify your account',
};

// Specify the queue name for processing jobs
const queueName = 'push_notification_code';

// Create a new Kue job with the specified queue and data
const job = queue.create(queueName, jobObj).save();

// Attach event listeners to the created job
job.on('enqueue', () => console.log(`Notification job created: ${job.id}`))
  .on('complete', () => console.log('Notification job completed'))
  .on('failed', () => console.log('Notification job failed'));
