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
// Return Requested Information
app.get('/blobapi/:filePath(*)', (req, res) => {
    try {
        const reqFilePath = req.params.filePath;
        const fileDir = '/opt/app/build/images';
        const filePath = path_1.default.join(__dirname, fileDir, reqFilePath);
        logger.info(__dirname);
        // Return File
        if (fs_1.default.existsSync(filePath) && fs_1.default.lstatSync(filePath).isDirectory()) {
            fs_1.default.readdir(filePath, (err, files) => {
                if (err) {
                    return res.status(404).json({ error: 'Path not found' });
                }
                // Return the list of files and directories in JSON format
                const fileList = [];
                files.forEach(file => {
                    const processPath = path_1.default.join(filePath, file);
                    const fileType = fs_1.default.statSync(processPath).isDirectory() ? 'directory' : 'file';
                    fileList.push({ name: file, type: fileType });
                });
                res.json(fileList);
            });
        }
        else if (fs_1.default.existsSync(filePath) && fs_1.default.lstatSync(filePath).isFile()) {
            const stream = fs_1.default.createReadStream(filePath);
            stream.pipe(res);
        }
        else {
            res.status(404).json({ error: 'File not found' });
            logger.error(`File Path Request: ${filePath}`);
        }
        ;
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
