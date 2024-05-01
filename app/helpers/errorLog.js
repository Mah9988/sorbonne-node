const morgan = require("morgan");

// Create a Morgan error logging middleware
const errorLogger = morgan("combined", {
  skip: (req, res) => {
    console.log("-------------------------------");
    console.log("----------Request------------");
    console.log("-------------------------------");
    console.log(req);
    console.log("-------------------------------");
    console.log("----------Response------------");
    console.log("-------------------------------");
    console.log(res);
  }, // Skip non-error requests
  stream: process.stderr, // Log errors to the console
});

module.exports = errorLogger;
