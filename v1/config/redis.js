const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379', // Default Redis URL
});

// Connect to Redis
redisClient.connect()
  .then(() => {
    console.log('Connected to Redis successfully');
  })
  .catch((error) => {
    console.error('Redis connection error:', error);
  });

module.exports = redisClient;
