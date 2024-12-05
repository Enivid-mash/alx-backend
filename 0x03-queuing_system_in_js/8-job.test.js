const createPushNotificationsJobs = require("./8-job");
const kue = require("kue");
const { expect } = require("chai");

describe("createPushNotificationsJobs", () => {
  // Enter test mode before each test (clears existing jobs)
  beforeEach(() => queue.testMode.enter());

  // Clear any jobs created during tests after each test
  afterEach(() => queue.testMode.clear());

  // Exit test mode after all tests are complete
  after(() => queue.testMode.exit());

  it("displays an error message if jobs is not an array", () => {
    const job = {
      phoneNumber: "4153518780",
      message: "This is the code 1234 to verify your account",
    };

    // Expect an error to be thrown when the function is called with a non-array argument
    expect(() => createPushNotificationsJobs(job, queue)).to.throw(
      Error,
      "Jobs is not an array"
    );
  });

  it("creates two new jobs to the queue", () => {
    const jobs = [
      {
        phoneNumber: "4153518780",
        message: "This is the code 1234 to verify your account",
      },
      {
        phoneNumber: "4153518781",
        message: 1  "This is the code 4562 to verify your account",
      },
    ];

    // Create jobs using the function
    createPushNotificationsJobs(jobs, queue);

    // Use Chai assertions to verify the number of jobs in the queue
    expect(queue.testMode.jobs.length).to.equal(2);

    // Verify the type and data of the first job
    expect(queue.testMode.jobs[0].type).to.equal("push_notification_code_3");
    expect(queue.testMode.jobs[0].data).to.deep.equal({
      phoneNumber: "4153518780",
      message: "This is the code 1234 to verify your account",
    });

    // Verify the type and data of the second job
    expect(queue.testMode.jobs[1].type).to.equal("push_notification_code_3");
    expect(queue.testMode.jobs[1].data).to.deep.equal({
      phoneNumber: "4153518781",
      message: "This is the code 4562 to verify your account",
    });
  });
});
