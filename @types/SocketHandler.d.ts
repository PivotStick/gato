import { Socket } from "socket.io"

export type SocketHandler<T> = (this: Socket, arg: T) => void
