// import { useSocket } from '@/context/SocketContext';
// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';

// const VideoChat = () => {
// 	const [roomID, setRoomID] = useState('');
// 	const [isHost, setIsHost] = useState(false);
// 	const localVideoRef = useRef(null);
// 	const remoteVideoRefs = useRef({});
// 	const localStreamRef = useRef(null);
// 	const peerConnectionsRef = useRef({});
// 	const [users, setUsers] = useState([]);

//     const { socket, socketOn, socketEmit, socketOff } = useSocket();

// 	const getMedia = async () => {
// 		const stream = await navigator.mediaDevices.getUserMedia({
// 			video: true,
// 			audio: true,
// 		});
// 		localVideoRef.current.srcObject = stream;
// 		localStreamRef.current = stream;
// 	};

// 	const createRoom = async () => {
// 		const room = prompt('Enter Room ID');
// 		if (room && socket) {
// 			setRoomID(room);
// 			setIsHost(true);
// 			socketEmit('createRoom', room);
// 			await getMedia();
// 		}
// 	};

// 	const joinRoom = async () => {
// 		const room = prompt('Enter Room ID');
// 		if (room && socket) {
// 			setRoomID(room);
// 			socket.emit('joinRoom', room, async ({ allowed }) => {
// 				if (allowed) {
// 					await getMedia();
// 					socket.on('signal', handleSignal);
// 				} else {
// 					alert('Permission denied by host.');
// 				}
// 			});
// 		}
// 	};

// 	const handleSignal = (signalData) => {
// 		const { from, type, candidate, sdp } = signalData;
// 		if (type === 'offer') {
// 			handleOffer(from, sdp);
// 		} else if (type === 'answer') {
// 			handleAnswer(from, sdp);
// 		} else if (candidate) {
// 			handleCandidate(from, candidate);
// 		}
// 	};

// 	const handleOffer = async (from, sdp) => {
// 		const peerConnection = createPeerConnection(from);
// 		await peerConnection.setRemoteDescription(
// 			new RTCSessionDescription({ type: 'offer', sdp })
// 		);
// 		const answer = await peerConnection.createAnswer();
// 		await peerConnection.setLocalDescription(answer);
// 		socketEmit('signal', { to: from, type: 'answer', sdp: answer.sdp });
// 	};

// 	const handleAnswer = async (from, sdp) => {
// 		const peerConnection = peerConnectionsRef.current[from];
// 		if (peerConnection) {
// 			await peerConnection.setRemoteDescription(
// 				new RTCSessionDescription({ type: 'answer', sdp })
// 			);
// 		}
// 	};

// 	const handleCandidate = async (from, candidate) => {
// 		const peerConnection = peerConnectionsRef.current[from];
// 		if (peerConnection) {
// 			await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
// 		}
// 	};

// 	const createPeerConnection = (userId) => {
// 		const iceServers = {
// 			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
// 		};
// 		const peerConnection = new RTCPeerConnection(iceServers);

// 		peerConnection.onicecandidate = ({ candidate }) => {
// 			if (candidate) {
// 				socket.emit('signal', { to: userId, type: 'candidate', candidate });
// 			}
// 		};

// 		peerConnection.ontrack = ({ streams: [stream] }) => {
// 			if (!remoteVideoRefs.current[userId]) {
// 				remoteVideoRefs.current[userId] = React.createRef();
// 				setUsers((prevUsers) => [...prevUsers, userId]);
// 			}
// 			remoteVideoRefs.current[userId].current.srcObject = stream;
// 		};

// 		localStreamRef.current
// 			.getTracks()
// 			.forEach((track) =>
// 				peerConnection.addTrack(track, localStreamRef.current)
// 			);
// 		peerConnectionsRef.current[userId] = peerConnection;
// 		return peerConnection;
// 	};

// 	const handleNewUser = (userId) => {
// 		if (!peerConnectionsRef.current[userId]) {
// 			const peerConnection = createPeerConnection(userId);
// 			peerConnection
// 				.createOffer()
// 				.then((offer) => peerConnection.setLocalDescription(offer))
// 				.then(() => {
// 					socket.emit('signal', {
// 						to: userId,
// 						type: 'offer',
// 						sdp: peerConnection.localDescription.sdp,
// 					});
// 				});
// 		}
// 	};

// 	useEffect(() => {
// 		if (socket) {
// 			socket.on('requestJoin', (clientID) => {
// 				const allow = window.confirm(`Allow user ${clientID} to join?`);
// 				socket.emit('responseJoin', allow);
// 			});

// 			socket.on('userJoined', (clientID) => {
// 				handleNewUser(clientID);
// 			});

// 			socket.on('hostLeft', () => {
// 				alert('Host left the room.');
// 				// Handle host leaving
// 			});

// 			socket.on('userLeft', (clientID) => {
// 				alert(`User ${clientID} left the room.`);
// 				if (peerConnectionsRef.current[clientID]) {
// 					peerConnectionsRef.current[clientID].close();
// 					delete peerConnectionsRef.current[clientID];
// 				}
// 				setUsers((prevUsers) => prevUsers.filter((id) => id !== clientID));
// 			});
// 		}
// 	}, [handleNewUser, socket]);

// 	return (
// 		<div>
// 			<div>
// 				<video ref={localVideoRef} autoPlay playsInline></video>
// 				{users.map((userId) => (
// 					<video
// 						key={userId}
// 						ref={remoteVideoRefs.current[userId]}
// 						autoPlay
// 						playsInline
// 					></video>
// 				))}
// 			</div>
// 			<button onClick={createRoom}>Create Room</button>
// 			<button onClick={joinRoom}>Join Room</button>
// 		</div>
// 	);
// };

// export default VideoChat;
