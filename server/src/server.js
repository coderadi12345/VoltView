import http from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './sockets/socket.js';
import { startEnergySimulationJob } from './jobs/energySimulation.job.js';

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  initSocket(io);

  server.listen(env.port, () => {
    console.log(`VoltView API running on port ${env.port}`);
    startEnergySimulationJob();
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
