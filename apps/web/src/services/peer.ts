'use client';
class PeerService {
	peer: RTCPeerConnection | null = null;

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
		if(this.peer){
			const remoteDesc = new RTCSessionDescription(answer);
			await this.peer.setRemoteDescription(remoteDesc);
		}


	}
}

const peerService = new PeerService();
export default peerService;
