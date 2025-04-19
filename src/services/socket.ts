import { LeaderboardPayload } from '../types/types';
import { io, Socket } from 'socket.io-client'

export default class SocketClient {
  private static instance: SocketClient
  private socket: Socket
  private leaderboardCallback: ((data: LeaderboardPayload) => void) | null = null

  private constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_SERVER_URL)
    this.setupEventHandlers()
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  private setupEventHandlers() {
    this.socket.on('leaderboardUpdate', (data: LeaderboardPayload) => {
      if (this.leaderboardCallback) {
        this.leaderboardCallback(data)
      }
    })

    this.socket.on('identify', (data: { userId: number }) => {
      console.log('identify', data)
    })

    this.socket.on('removeIdentify', (data: { userId: number }) => {
      console.log('removeIdentify', data)
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    this.socket.on('connect', () => {
      console.log('Socket connected')
    })
  }

  public identifyUser(userId: number) {
    this.socket.emit('identify', { userId })
  }

  public removeIdentify() {
    this.socket.emit('removeIdentify', { userId: this.socket.id })
  }

  public onLeaderboardUpdate(callback: (data: LeaderboardPayload) => void) {
    this.leaderboardCallback = callback
  }

  public subscribe(stockIds: number[]) {
    this.socket.emit('subscribe', stockIds)
  }

  public unsubscribe(stockIds: number[]) {
    this.socket.emit('unsubscribe', stockIds)
  }

  public disconnect() {
    console.log('disconnecting socket')
    this.socket.disconnect()
  }
} 
