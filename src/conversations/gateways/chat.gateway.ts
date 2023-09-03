import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from '@/users/services/users.service';
import { Message } from '@/messages/entities/message.entity';
import { config } from '@/config/configutation';
import { UserDto } from '@/users/dtos/user.dto';

const clientsMap: Record<string, number> = {};

@WebSocketGateway(config.wsPort, {
  cors: config.isDev
    ? { origin: '*' }
    : {
        origin: ['https://chat-api.link'],
        methods: ['GET', 'POST', 'UPDATE', 'OPTIONS'],
        credentials: true,
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

  @SubscribeMessage('messagesRead')
  async handleMessagesRead(client: Socket, payload: string): Promise<void> {
    const fromId = clientsMap[client.id];
    const destinationIds = this.getSocketClientIdsByUserId(Number(payload));
    this.server.sockets.to(destinationIds).emit('messagesRead', fromId);
  }

  afterInit(server: Server) {
    console.log('Websocket is running', server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Websocket client disconnected: ${client.id}`);
    delete clientsMap[client.id];
    this.notifyConnectedClients();
  }

  async handleConnection(client: Socket) {
    try {
      const accessToken = client.handshake.query['accessToken'] as string;
      const user = await this.usersService.getUserFromAccessToken(accessToken);
      if (user) {
        clientsMap[client.id] = user.id;
        console.log(`Websocket client connected: ${client.id}`);
        await this.notifyConnectedClients();
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async notifyConnectedClients() {
    const connectedUsersIds = this.getConnectedUserIds();
    const connectedUsers: UserDto[] = [];
    for (const userId of connectedUsersIds) {
      const user = await this.usersService.findById(userId);
      if (user) {
        connectedUsers.push(user);
      }
    }
    const payload = JSON.stringify(connectedUsers);
    this.server.sockets
      .to(this.getConnectedSocketClientIds())
      .emit('connectedUsers', payload);
  }

  private sendMessageToDestination(messageJson: string) {
    const message: Message = JSON.parse(messageJson);
    const clientIds = this.getSocketClientIdsByUserId(message.to.id);
    if (clientIds) {
      clientIds.forEach((clientId) => {
        this.server.sockets.to(clientId).emit('messageReceived', messageJson);
        console.log(`Websocket sent message to ${clientId}`);
      });
    }
  }

  private getSocketClientIdsByUserId(userId: number): Array<string> {
    // Client Id is the key of the userId in the clientsMap
    return this.getConnectedSocketClientIds().filter(
      (clientId) => clientsMap[clientId] === userId,
    );
  }

  private getConnectedSocketClientIds(): Array<string> {
    return Object.keys(clientsMap);
  }

  private getConnectedUserIds(): Array<number> {
    return this.removeDuplicates(Object.values(clientsMap));
  }

  private removeDuplicates<T = any>(array: Array<T>): Array<T> {
    return [...new Set(array)];
  }
}
