const jobs = [
  // Array of job objects containing phone numbers and verification codes
  {
    phoneNumber: "4153518780",
    message: "This is the code 1234 to verify your account",
  },
  // ... other job objects
];

const kue = require("kue");

// Create a Kue queue instance
const queue = kue.createQueue();

// Loop through each job in the list
jobs.forEach((job) => {
  // Create a new Kue job with the specified queue and data
  const newJob = queue.create("push_notification_code_2", job).save();

  // Attach event listeners to the created job
  newJob.on('enqueue', () => console.log(`Notification job created: ${newJob.id}`))
    .on('complete', () => console.log(`Notification job ${newJob.id} completed`))
    .on('failed', (err) => console.log(`Notification job ${newJob.id} failed: ${err}`))
    .on('progress', (progress) => console.log(`Notification job ${newJob.id} ${progress}% complete`));
});
