'use client';
class WebRTCService2 {
	private peer: RTCPeerConnection | null = null;
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

	async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
		// await this.startConnection();

		if (this.peer) {
			const offer = await this.peer.createOffer();
			const sessionDescription = new RTCSessionDescription(offer!);
			await this.peer?.setLocalDescription(sessionDescription);
			return offer;
		}
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

	async addAnswer(answer: RTCSessionDescriptionInit) {
		if (this.peer) {
			// await this.createPeerConnection();
			const remoteDesc = new RTCSessionDescription(answer);
			await this.peer?.setRemoteDescription(remoteDesc);
		}
	}

	async setLocalDescription(answer: RTCSessionDescriptionInit) {
		if (this.peer) {
			const remoteDesc = new RTCSessionDescription(answer);
			await this.peer.setRemoteDescription(remoteDesc);
		}
	}

	async disconnectPeer() {
		this.peer?.close();
		this.peer = null;
		this.localStream?.getTracks().forEach((track) => track.stop());
		this.localStream = null;
		this.remoteStream = null;
	}

	async createAnswer(offer: RTCSessionDescriptionInit) {
		// if (this.peer && this.localStream) {
		// await this.startConnection();

		await this.peer?.setRemoteDescription(new RTCSessionDescription(offer));

		const answer = await this.peer?.createAnswer();
		const sessionDescription = new RTCSessionDescription(answer!);
		await this.peer?.setLocalDescription(sessionDescription);
		return answer;
		// }
	}

	// async addAnswer(answer: RTCSessionDescriptionInit) {
	// 	if (this.peer) {
	// 		// await this.createPeerConnection();
	// 		// const remoteDesc = new RTCSessionDescription(answer);
	// 		await this.peer?.setRemoteDescription(answer);
	// 	}
	// }
}

const webRTC = new WebRTCService2();
export default webRTC;
