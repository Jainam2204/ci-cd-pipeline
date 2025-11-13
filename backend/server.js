// Name : Jainam Vora
// Student Id : 202412122

const express = require('express');
const client = require('prom-client');

const app = express();

const register = client.register;
client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests'
});

app.use((req, res, next) => {
  requestCounter.inc();
  next();
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString()
  });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.send(metrics);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
