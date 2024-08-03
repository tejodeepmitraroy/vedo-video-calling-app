// server.js

// const rooms = {};

// io.on('connection', (socket) => {
// 	console.log('A user connected');

// 	socket.on('createRoom', (roomID) => {
// 		if (!rooms[roomID]) {
// 			rooms[roomID] = {
// 				host: socket.id,
// 				clients: new Set(),
// 			};
// 			socket.join(roomID);
// 			console.log(`Room ${roomID} created and host joined.`);
// 		}
// 	});

// 	socket.on('joinRoom', (roomID, callback) => {
// 		const room = rooms[roomID];
// 		if (room) {
// 			if (room.host === socket.id || room.clients.has(socket.id)) {
// 				// Rejoining user
// 				socket.join(roomID);
// 				callback({ allowed: true });
// 			} else if (room.host) {
// 				// Notify host for permission
// 				io.to(room.host).emit('requestJoin', socket.id);
// 				socket.on('responseJoin', (allowed) => {
// 					if (allowed) {
// 						socket.join(roomID);
// 						room.clients.add(socket.id);
// 						callback({ allowed: true });
// 						io.to(roomID).emit('userJoined', socket.id);
// 					} else {
// 						callback({ allowed: false });
// 					}
// 				});
// 			}
// 		} else {
// 			callback({ allowed: false });
// 		}
// 	});

// 	socket.on('signal', ({ roomID, signalData }) => {
// 		io.to(roomID).emit('signal', signalData);
// 	});

// 	socket.on('disconnect', () => {
// 		console.log('A user disconnected');
// 		for (const [roomID, room] of Object.entries(rooms)) {
// 			if (room.host === socket.id) {
// 				io.to(roomID).emit('hostLeft');
// 				delete rooms[roomID];
// 			} else if (room.clients.has(socket.id)) {
// 				room.clients.delete(socket.id);
// 				io.to(roomID).emit('userLeft', socket.id);
// 			}
// 		}
// 	});
// });
