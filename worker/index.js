const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (Number(index) < 2) return 1;
  return fib(Number(index) - 1) + fib(Number(index) - 2);
}

sub.on('message', (channel, message) => {
  console.log("message arrived", message);
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
