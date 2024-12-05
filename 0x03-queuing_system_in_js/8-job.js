function createPushNotificationsJobs(jobs, queue) {
  // Validate input: Ensure `jobs` is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs must be an array of notification objects');
  }

  // Loop through each job in the list
  jobs.forEach((job) => {
    // Create a new Kue job with the specified queue and data
    const newJob = queue.create('push_notification_code_3', job);

    // Attach event listeners to the created job
    newJob.on('complete', () => console.log(`Notification job ${newJob.id} completed`))
      .on('failed', (err) => console.log(`Notification job ${newJob.id} failed: ${err}`))
      .on('progress', (progress) => console.log(`Notification job ${newJob.id} ${progress}% complete`));

    // Save the job and optionally handle the saving result
    newJob.save((err) => {
      if (!err) {
        console.log(`Notification job created: ${newJob.id}`);
      } else {
        console.error(`Error creating job ${newJob.id}: ${err}`);
      }
    });
  });
}

module.exports = createPushNotificationsJobs;
