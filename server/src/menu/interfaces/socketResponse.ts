export interface SocketResponse {
  status: number;
  response: {
    statusCode: number;
    message: string;
  };
}
