'use client';

// import { Socket } from 'socket.io-client';

class WebRTCService {
	private peer: RTCPeerConnection | null;
	private localStream: MediaStream | null;
	private remoteStream: MediaStream | null;
	// private onTrack: (stream: MediaStream) => void;
	// private isHost: boolean;

	// constructor(onTrack: (stream: MediaStream) => void, isHost: boolean) {
	constructor() {
		this.peer = null;
		this.localStream = null;
		this.remoteStream = null;
		// this.onTrack = onTrack;
		// this.isHost = isHost;
	}

	// public async getUserMedia({
	// 	selectedCamera,
	// 	selectedMicrophone,
	// }: {
	// 	selectedCamera: string;
	// 	selectedMicrophone: string;
	// }) {
	public async getUserMedia() {
		try {
			const constraints = {
				video:
					//  selectedCamera
					// 	? {
					// 			deviceId: { exact: selectedCamera },
					// 			width: { ideal: 1280 },
					// 			height: { ideal: 720 },
					// 		}
					// 	:
					{
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},

				audio:
					// selectedMicrophone
					// 	? { deviceId: { exact: selectedMicrophone } }:
					true,
			};

			// console.log(' constraints', constraints);

			this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
			return this.localStream;
		} catch (error) {
			console.error('Error accessing media devices:', error);
		}
	}

	public async startConnection() {
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

		this.remoteStream = new MediaStream();

		this.peer.ontrack = async (event) => {
			const [remoteStream] = event.streams;
			this.remoteStream = remoteStream;
			// this.onTrack(this.remoteStream);
			console.log('Remote Stream---->', remoteStream);
		};

		if (this.localStream) {
			this.localStream.getTracks().forEach((track) => {
				console.log('sending tracks---->', track);
				this.peer?.addTrack(track, this.localStream as MediaStream);
			});
		}

		// if (!this.isHost) {
		// 	const offer = await this.peer.createOffer();
		// 	await this.peer.setLocalDescription(offer);
		// 	socket.emit('signal', { offer });
		// }
	}

	public getLocalStream(): MediaStream | null {
		return this.localStream;
	}

	public getRemoteStream(): MediaStream | null {
		return this.remoteStream;
	}

	async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
		await this.startConnection();

		const offer = await this.peer?.createOffer();
		const sessionDescription = new RTCSessionDescription(offer!);
		await this.peer?.setLocalDescription(sessionDescription);

		return offer;
	}

	// public async handleSignalData(data: any, socket: Socket) {
	// 	if (!this.peer) return;

	// 	if (data.offer) {
	// 		await this.peer.setRemoteDescription(
	// 			new RTCSessionDescription(data.offer)
	// 		);
	// 		const answer = await this.peer.createAnswer();
	// 		await this.peer.setLocalDescription(answer);

	// 		if (this.isHost) {
	// 			const hostOffer = await this.peer.createOffer();
	// 			await this.peer.setLocalDescription(hostOffer);
	// 			socket.emit('signal', { answer, hostOffer });
	// 		} else {
	// 			socket.emit('signal', { answer });
	// 		}
	// 	} else if (data.answer) {
	// 		await this.peer.setRemoteDescription(
	// 			new RTCSessionDescription(data.answer)
	// 		);
	// 	}
	// }

	async createAnswer(offer: RTCSessionDescriptionInit) {
		// if (this.peer && this.localStream) {
		await this.startConnection();

		await this.peer?.setRemoteDescription(new RTCSessionDescription(offer));

		const answer = await this.peer?.createAnswer();
		const sessionDescription = new RTCSessionDescription(answer!);
		await this.peer?.setLocalDescription(sessionDescription);
		return answer;
		// }
	}

	async addAnswer(answer: RTCSessionDescriptionInit) {
		if (this.peer) {
			// await this.createPeerConnection();
			// const remoteDesc = new RTCSessionDescription(answer);
			await this.peer?.setRemoteDescription(answer);
		}
	}

	// async getAnswer(
	// 	offer: RTCSessionDescriptionInit
	// ): Promise<RTCSessionDescriptionInit | undefined> {
	// 	if (this.peer) {
	// 		await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
	// 		const answer = await this.peer.createAnswer();
	// 		await this.peer.setLocalDescription(answer);
	// 		return answer;
	// 	}
	// }

	async setLocalDescription(answer: RTCSessionDescriptionInit) {
		if (this.peer) {
			const remoteDesc = new RTCSessionDescription(answer);
			await this.peer.setRemoteDescription(remoteDesc);
		}
	}

	async getAllMediaDevices() {
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

	// public async handleSignalData(data: any) {
	// 	if (!this.peer) return;

	// 	if (data.offer) {
	// 		await this.peer.setRemoteDescription(
	// 			new RTCSessionDescription(data.offer)
	// 		);
	// 		const answer = await this.peer.createAnswer();
	// 		await this.peer.setLocalDescription(answer);
	// 		return { answer };
	// 	} else if (data.answer) {
	// 		await this.peer.setRemoteDescription(
	// 			new RTCSessionDescription(data.answer)
	// 		);
	// 	} else if (data.candidate) {
	// 		await this.peer.addIceCandidate(new RTCIceCandidate(data.candidate));
	// 	}
	// }

	async disconnectPeer() {
		this.peer?.close();
		this.peer = null;
		this.localStream?.getTracks().forEach((track) => track.stop());
		this.localStream = null;
		this.remoteStream = null;
	}
}

const webRTCService = new WebRTCService();
export default webRTCService;
