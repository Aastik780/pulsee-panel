export interface TrackInfo {
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  position?: number;
  requestedBy: {
    username: string;
    avatar?: string;
  };
}

export interface QueueItem {
  title: string;
  artist: string;
  duration: number;
  requestedBy: {
    username: string;
  };
}

export interface BotStats {
  online: boolean;
  guilds: number;
  users: number;
  ping: number;
  uptimeSeconds: number;
}

export interface SystemInfo {
  cpuUsage: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  nodeVersion: string;
  platform: string;
}

export type StatusSource = 'live' | 'demo' | 'offline';

export interface StatusPayload {
  source: StatusSource;
  bot: BotStats;
  nowPlaying: TrackInfo | null;
  queue: QueueItem[];
  system: SystemInfo;
  updatedAt: string;
}
