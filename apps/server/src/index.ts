import http from 'http';
import * as dotenv from 'dotenv';
import SocketService from './services/socket';
import app from './app';

dotenv.config();

const socketService = new SocketService();

const httpServer = http.createServer(app);

socketService.io.attach(httpServer);

const PORT = process.env.PORT ? process.env.PORT : 8000;

httpServer.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});

socketService.initListeners();
