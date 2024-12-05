import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

// Create a Kue queue instance
const queue = kue.createQueue();

// Define a list of jobs to be processed
const jobsList = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
];

// Create and enqueue push notification jobs
createPushNotificationsJobs(jobsList, queue);
