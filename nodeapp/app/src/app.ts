import express, {Application, Request, Response} from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
const winston = require('winston');

// Logging settings
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
// Server Settings
const app: Application = express();
const port: number = 80;
const httpserver = http.createServer(app)
// Return Image File
app.get('/blobapi/images/:directory/:filename', (req: Request, res: Response) => {
  try{
    const { filename } = req.params;
    const { directory } = req.params;
    const imageDir = '/opt/app/build/images'
    const imagePath = path.join(imageDir, directory, filename);
    // Return Image
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
// Return List of Images
app.get('/blobapi/images/:directory', (req: Request, res: Response) => {
  try{
    const { directory } = req.params;
    const imageDir = '/opt/app/build/images';
    const directoryPath = path.join(imageDir, directory);
    // const files: string[] = [];
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(404).json({ error: 'ID not found or no images available for the ID' });
      }
      // Return the list of files in JSON format
      res.json({ directory, files });
  });
  } catch(e) {
    logger.error(e);
  };
});
// Return Connection Info
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
// Initiate server
httpserver.listen(port, () => logger.info(`Listing on port ${port}`));