export enum SocketEvent {
  // Message
  SEND_MESSAGE = 'sendMessage',
  MESSAGES_READ = 'messagesRead',
  MESSAGE_RECEIVED = 'messageReceived',
  CONNECTED_USERS = 'connectedUsers',
  // Video
  RTC_CONNECTION = 'rtcConnection',
  CALL_REQUEST = 'callRequest',
  CALL_RESPONSE = 'callResponse',
  CALL_END = 'callEnd',
  CALL_MEDIA_STATE = 'callMediaState',
}

export interface RTCConnectionMessage {
  fromId: number;
  toId: number;
  type: 'ice_candidate' | 'offer' | 'answer';
  data: RTCSessionDescriptionInit | RTCIceCandidate;
}

export interface CallRequest {
  fromId: number;
  toId: number;
}

export interface CallResponse {
  fromId: number;
  toId: number;
  response: 'yes' | 'no';
}

export interface CallMediaState {
  fromId: number;
  toId: number;
  video: boolean;
  audio: boolean;
}
