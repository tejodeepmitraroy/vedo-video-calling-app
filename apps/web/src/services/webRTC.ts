'use client';
class webRTCService {
	peer: RTCPeerConnection | null = null;
	// private peer: RTCPeerConnection | null;
	private localStream: MediaStream | null;
	private remoteStream: MediaStream | null;

	constructor() {
		if (!this.peer) {
			const configuration = {
				iceServers: [
					{
						urls: [
							'stun:stun.l.google.com:19302',
							'stun:global.stun.twilio.com:3478',
						],
					},
				],
			};

			this.peer = new RTCPeerConnection(configuration);
		}

		this.localStream = null;
		this.remoteStream = new MediaStream();
		//Peer Connection Lister
		this.peer.addEventListener('signalingstatechange', (event) => {
			console.log('signaling Event Change!');
			console.log('Event=======>', event);
			console.log(this.peer?.signalingState);
		});

		// //Listen Ice Candidate
		// this.peer.addEventListener('icecandidate', (event) => {
		// 	console.log('Found and ice candidate');
		// 	if (event.candidate) {
		// 		//emit the ice candidate to the signaling server
		// 		console.log(event.candidate);
		// 	}
		// });

		this.peer.addEventListener('track', async (event) => {
			event.streams[0].getTracks().forEach((track) => {
				console.log('Remote tracks---->', track);
				console.log('Remote Stream---->', this.remoteStream);
				this.remoteStream?.addTrack(track);
			});
		});
	}

	public async getAllMediaDevices() {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const cameras = devices.filter((device) => device.kind === 'videoinput');
			const microphones = devices.filter(
				(device) => device.kind === 'audioinput'
			);

			return { cameras, microphones };
		} catch (error) {
			console.error('Error opening video camera.', error);
		}
	}

	public async getUserMedia({
		camera,
		microphone,
	}: {
		camera: string;
		microphone: string;
	}) {
		try {
			const constraints = {
				video: camera
					? {
							deviceId: { exact: camera },
							width: { ideal: 1280 },
							height: { ideal: 720 },
							cursor: 'never',
						}
					: {
							width: { ideal: 1280 },
							height: { ideal: 720 },
							cursor: 'never',
						},

				audio: microphone ? { deviceId: { exact: microphone } } : true,
			};

			this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
			// console.log('Got MediaStream:', this.localStream);

			return this.localStream;
		} catch (error) {
			console.error('Error accessing media devices:', error);
		}
	}

	public getRemoteStream(): MediaStream | undefined {
		if (this.remoteStream) {
			return this.remoteStream;
		}
	}

	public getLocalStream(): MediaStream | undefined {
		if (this.localStream) {
			return this.localStream;
		}
	}

	async createOffer(): Promise<RTCSessionDescriptionInit | undefined> {
		if (this.peer && this.localStream) {
			this.localStream.getTracks().forEach((track) => {
				console.log('sending tracks---->', track);
				this.peer?.addTrack(track, this.localStream as MediaStream);
			});

			const offer = await this.peer.createOffer();
			await this.peer.setLocalDescription(new RTCSessionDescription(offer));

			return offer;
		}
	}

	async getAnswer(offer: RTCSessionDescriptionInit) {
		if (this.peer) {
			await this.peer.setRemoteDescription(offer);
			const answer = await this.peer.createAnswer();

			await this.peer.setLocalDescription(new RTCSessionDescription(answer));
			return answer;
		}
	}

	async setRemoteDescription(answer: RTCSessionDescriptionInit) {
		if (this.peer) {
			await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
		}
	}

	public connectionStatus() {
		if (this.peer) {
			if (this.peer.connectionState === 'connected') {
				return 'connected';
			} else {
				return 'not connected';
			}
		}
	}
	async disconnectPeer() {
		this.peer?.close();
		this.peer = null;
		this.localStream?.getTracks().forEach((track) => track.stop());
		this.localStream = null;
		this.remoteStream = null;
	}

	// public async startConnection() {
	// 	this.remoteStream = new MediaStream();

	// 	this.peer.ontrack = async (event) => {
	// 		const [remoteStream] = event.streams;
	// 		this.remoteStream = remoteStream;
	// 		// this.onTrack(this.remoteStream);
	// 		console.log('Remote Stream---->', remoteStream);
	// 	};

	// 	if (this.localStream) {
	// 		this.localStream.getTracks().forEach((track) => {
	// 			console.log('sending tracks---->', track);
	// 			this.peer?.addTrack(track, this.localStream as MediaStream);
	// 		});
	// 	}

	// 	// if (!this.isHost) {
	// 	// 	const offer = await this.peer.createOffer();
	// 	// 	await this.peer.setLocalDescription(offer);
	// 	// 	socket.emit('signal', { offer });
	// 	// }
	// }

	// async createAnswer(offer: RTCSessionDescriptionInit) {
	// 	await this.startConnection();

	// 	await this.peer?.setRemoteDescription(new RTCSessionDescription(offer));

	// 	const answer = await this.peer?.createAnswer();
	// 	const sessionDescription = new RTCSessionDescription(answer!);
	// 	await this.peer?.setLocalDescription(sessionDescription);
	// 	return answer;
	// }
}

export default new webRTCService();
