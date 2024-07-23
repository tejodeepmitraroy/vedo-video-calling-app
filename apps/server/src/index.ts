import http from 'http';
import * as dotenv from 'dotenv';
import app from './app';
import socketService from './services/socket';

dotenv.config();

const httpServer = http.createServer(app);

socketService.io.attach(httpServer);

const PORT = process.env.PORT ? process.env.PORT : 8000;

httpServer.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});

socketService.initListeners();
