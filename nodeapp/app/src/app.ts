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

// Return Requested Information
app.get('/blobapi/:filePath(*)', (req: Request, res: Response) => {
  try{
    const reqFilePath = req.params.filePath;
    const fileDir = '/opt/app/build/images'
    const filePath = path.join(__dirname, fileDir, reqFilePath);
    logger.info(__dirname);
    // Return File
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        if (err) {
          return res.status(404).json({ error: 'Path not found' });
        }
        // Return the list of files and directories in JSON format
        const fileList: { name: string, type: string }[] = [];
        files.forEach(file => {
          const processPath = path.join(filePath, file);
          const fileType = fs.statSync(processPath).isDirectory() ? 'directory' : 'file';
          fileList.push({ name: file, type: fileType });
        });
        res.json(fileList);
      }) 
    } else if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } else {
      res.status(404).json({ error: 'File not found' });
      logger.error(`File Path Request: ${filePath}`);
    };
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