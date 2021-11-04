export interface Keys {
  port: number;
  ORIGIN_CORS: string;
  SESSION_SECRET: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  MONGODB_URI: string;
  MONGODB_URI_WINTSON: string;
  ticketValidationInDays: number;
  timeBetweenPasswordResetsInHours: number;
  maxLogins: number;
  banDurationInHours: number;
  maxTicketUsagePerHour: number;
  WS_PORT: number;
}