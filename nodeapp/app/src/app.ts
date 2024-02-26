import express, {Application, Request, Response} from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
const winston = require('winston');

const logPath: string = '/var/log/blobapi'
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: path.join(logPath, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logPath, 'info.log')}),
  ],
});

const app: Application = express();
const port: number = 80;
const httpserver = http.createServer(app)

app.get('/blobapi/images/:directory/:filename', (req: Request, res: Response) => {
  try{
    const { filename } = req.params;
    const { directory } = req.params;
    const imageDir = '/opt/app/build/images'
    const imagePath = path.join(imageDir, directory, filename);
    if (fs.existsSync(imagePath)) {
      const stream = fs.createReadStream(imagePath);
      stream.pipe(res);
    } else {
      res.status(404).json({ error: 'Image not found' });
      logger.error(`Image Path Request: ${imagePath}`);
    };
  } catch(e) {
    logger.error(e);
  };
});

app.use((req, res) => {
  try {
    logger.info(`Connection Info: ${req.rawHeaders}`);
    res.on('finish', () => {
      logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
  } catch(e) {
    logger.error(e);
  };
});
  
httpserver.listen(port, () => logger.info(`Listing on port ${port}`));