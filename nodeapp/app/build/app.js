"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston = require('winston');
// Logging settings
const logPath = '/var/log/blobapi';
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: path_1.default.join(logPath, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path_1.default.join(logPath, 'info.log') }),
    ],
});
// Server Settings
const app = (0, express_1.default)();
const port = 80;
const httpserver = http_1.default.createServer(app);
// Return Image File
app.get('/blobapi/images/:directory/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const { directory } = req.params;
        const imageDir = '/opt/app/build/images';
        const imagePath = path_1.default.join(imageDir, directory, filename);
        // Return Image
        if (fs_1.default.existsSync(imagePath)) {
            const stream = fs_1.default.createReadStream(imagePath);
            stream.pipe(res);
        }
        else {
            res.status(404).json({ error: 'Image not found' });
            logger.error(`Image Path Request: ${imagePath}`);
        }
        ;
    }
    catch (e) {
        logger.error(e);
    }
    ;
});
// Return List of Images
app.get('/blobapi/images/:directory', (req, res) => {
    try {
        const { directory } = req.params;
        const imageDir = '/opt/app/build/images';
        const directoryPath = path_1.default.join(imageDir, directory);
        // const files: string[] = [];
        fs_1.default.readdir(directoryPath, (err, files) => {
            if (err) {
                return res.status(404).json({ error: 'ID not found or no images available for the ID' });
            }
            // Return the list of files in JSON format
            res.json({ directory, files });
        });
    }
    catch (e) {
        logger.error(e);
    }
    ;
});
// Return Connection Info
app.use((req, res) => {
    try {
        logger.info(`Connection Info: ${req.rawHeaders}`);
        res.on('finish', () => {
            logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
        });
    }
    catch (e) {
        logger.error(e);
    }
    ;
});
// Initiate server
httpserver.listen(port, () => logger.info(`Listing on port ${port}`));
