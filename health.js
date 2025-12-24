const axios = require('axios');
require('dotenv').config();

const PARTNER_URL = `${process.env.PARTNER}`;
const PARTNER_URL1 = `${process.env.PARTNER1}`;

// Function to send health check request
const sendHealthCheck = async () => {
  try {
    const response = await axios.get(`${PARTNER_URL}/on`);
    const response1 = await axios.get(`${PARTNER_URL1}/`);
    console.log('Health check sent to partner server:', response.data);
    console.log('Health check sent to partner server:', response1.data);
  } catch (error) {
    console.error('Failed to send health check:', error.message);
  }
};

function getRandomInterval() {
  // Random time between 1 and 3 minutes in milliseconds
  return Math.floor(Math.random() * (180000 - 60000 + 1)) + 60000;
};

// Start the timer to send requests randomly
const startHealthCheckTimer = () => {
  // Send first check immediately
  sendHealthCheck();
  
  // Then send with random intervals using recursive setTimeout
  const scheduleNextCheck = () => {
    setTimeout(() => {
      sendHealthCheck();
      scheduleNextCheck(); // Schedule the next check with a new random interval
    }, getRandomInterval());
  };
  
  scheduleNextCheck();
};

// Handle incoming health check
const receiveHealthCheck = (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`Health check received at ${timestamp}`);
  
  res.json({
    status: 'active',
    server: 'health',
    timestamp
  });
};

module.exports = {
  startHealthCheckTimer,
  receiveHealthCheck
};
