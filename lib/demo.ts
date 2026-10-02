import type { StatusPayload } from './types';

export function demoStatus(source: 'demo' | 'offline' = 'demo'): StatusPayload {
  return {
    source,
    bot: {
      online: source === 'demo',
      guilds: 12,
      users: 486,
      ping: 42,
      uptimeSeconds: 2 * 3600 + 14 * 60 + 3,
    },
    nowPlaying:
      source === 'demo'
        ? {
            title: 'After Dark',
            artist: 'Mr.Kitty',
            thumbnail: '',
            duration: 259,
            position: 97,
            requestedBy: { username: 'aastik' },
          }
        : null,
    queue:
      source === 'demo'
        ? [
            { title: 'Sweater Weather', artist: 'The Neighbourhood', duration: 200, requestedBy: { username: 'night owl' } },
            { title: 'Floating', artist: 'Drift', duration: 184, requestedBy: { username: 'aastik' } },
            { title: 'Nightcall', artist: 'Kavinsky', duration: 258, requestedBy: { username: 'retrowaves' } },
            { title: 'Resonance', artist: 'HOME', duration: 212, requestedBy: { username: 'aastik' } },
          ]
        : [],
    system: {
      cpuUsage: 17,
      memoryUsage: { heapUsed: 92, heapTotal: 148, rss: 186 },
      nodeVersion: 'v22.14.0',
      platform: 'win32',
    },
    updatedAt: new Date().toISOString(),
  };
}
