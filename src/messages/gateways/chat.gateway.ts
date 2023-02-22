import { UsersService } from '@/users/services/users.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from '../entities/message.entity';

const clientsMap: Record<string, number> = {};

@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
  allowEIO3: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private usersService: UsersService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(_client: Socket, payload: string): Promise<void> {
    this.sendMessageToDestination(payload);
  }

  afterInit(server: Server) {
    console.log('Websocket is running', server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    delete clientsMap[client.id];
  }

  async handleConnection(client: Socket) {
    try {
      const accessToken = client.handshake.query['accessToken'] as string;
      const user = await this.usersService.getUserFromAccessToken(accessToken);
      if (user) {
        clientsMap[client.id] = user.id;
        console.log(`Connected ${client.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private sendMessageToDestination(messageJson: string) {
    const message: Message = JSON.parse(messageJson);
    const clientId = Object.keys(clientsMap).find(
      (key) => clientsMap[key] === message.to.id,
    );
    if (clientId) {
      this.server.sockets.to(clientId).emit('messageReceived', messageJson);
      console.log(`Sent message to ${clientId}`);
    }
  }
}
