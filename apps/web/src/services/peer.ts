'use client';

import { useRoomStore } from "@/store/useStreamStore";

class PeerService {
	peer: RTCPeerConnection | null = null;
	private store: ReturnType<typeof useRoomStore>;

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
		this.store = useRoomStore.getState();
	}

	async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
		if (this.peer) {
			const offer = await this.peer.createOffer();
			const sessionDescription = new RTCSessionDescription(offer);
			await this.peer.setLocalDescription(sessionDescription);
			return offer;
		}
	}

	async getAnswer(
		offer: RTCSessionDescriptionInit
	): Promise<RTCSessionDescriptionInit | undefined> {
		if (this.peer) {
			await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await this.peer.createAnswer();
			await this.peer.setLocalDescription(answer);
			return answer;
		}
	}

	async setLocalDescription(answer: RTCSessionDescriptionInit) {
		if (this.peer) {
			const remoteDesc = new RTCSessionDescription(answer);
			await this.peer.setRemoteDescription(remoteDesc);
		}
	}

	async disconnectPeer() {
		if (this.peer) {
			this.peer.close();
			this.peer = null;
		}
	}

	// async getMediaDevices() {
	// 	try {
	// 		const devices = await navigator.mediaDevices.enumerateDevices();
	// 		const cameras = devices.filter((device) => device.kind === 'videoinput');
	// 		const microphones = devices.filter(
	// 			(device) => device.kind === 'audioinput'
	// 		);

			
	// 		this.store.setMediaDevices({ cameras, microphones });
	// 	} catch (error) {
	// 		console.error('Error opening video camera.', error);
	// 	}
	// }
}

const peerService = new PeerService();
export default peerService;
