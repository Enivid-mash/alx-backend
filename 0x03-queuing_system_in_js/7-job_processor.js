import kue from "kue";

// Define an array of blacklisted phone numbers
const blacklistedNum = ["4153518780", "4153518781"];

// Function to send notification with progress reporting and error handling
function sendNotification(phoneNumber, message, job, done) {
  const total = 100; // Total progress units

  // Report initial progress (0%)
  job.progress(0, total);

  // Check for blacklisted number
  if (blacklistedNum.includes(phoneNumber)) {
    const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
    done(error); // Signal job failure with error
    return;
  }

  // Report progress (50%)
  job.progress(50, total);

  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );

  // Signal successful job completion
  done();
}

// Create a Kue queue instance
const queue = kue.createQueue();
const queueName = "push_notification_code_2";

// Process jobs in the specified queue with concurrency of 2
queue.process(queueName, 2, (job, done) => {
  const { phoneNumber, message } = job.data; // Destructure job data
  sendNotification(phoneNumber, message, job, done);
});
