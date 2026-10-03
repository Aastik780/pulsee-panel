'use client';

import { useEffect, useRef, useState } from 'react';

import type { StatusPayload } from '@/lib/types';

const REFRESH_MS = 5000;

function fmtDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function fmtUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function initials(name: string): string {
  return name
    .split(/[\s_-]+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function Avatar({ username, src }: { username: string; src?: string }) {
  if (src) return <img className="avatar" src={src} alt={username} />;
  return <span className="avatar avatar-fallback">{initials(username)}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let alive = true;

    async function sync() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: StatusPayload = await res.json();
        if (!alive) return;
        setData(json);
        setError(null);
        setLastSync(new Date());
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message ?? 'fetch failed');
      }
    }

    sync();
    timer.current = setInterval(sync, REFRESH_MS);
    return () => {
      alive = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const bot = data?.bot;
  const np = data?.nowPlaying;
  const progress = np && np.duration > 0 ? Math.min(100, ((np.position ?? 0) / np.duration) * 100) : 0;
  const source = data?.source ?? 'demo';
  const sourceLabel = source === 'live' ? 'LIVE' : source === 'offline' ? 'BOT OFFLINE' : 'DEMO DATA';

  return (
    <div className="panel">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">♪</span>
          <div>
            <h1>Pulsee Panel</h1>
            <p>Discord music bot — live monitoring</p>
          </div>
        </div>
        <div className="header-right">
          <span className={`badge badge-${source}`}>{sourceLabel}</span>
          <span className="sync">
            {lastSync
              ? `synced ${lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'connecting…'}
          </span>
        </div>
      </header>

      {error && !data && <div className="banner">Could not reach the panel API: {error}</div>}

      {!data ? (
        <div className="grid stats-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      ) : (
        <>
          <section className="grid stats-grid">
            <div className="card stat">
              <span className="stat-label">Status</span>
              <span className={`stat-value ${bot?.online ? 'ok' : 'down'}`}>
                <span className={`dot ${bot?.online ? 'on' : 'off'}`} />
                {bot?.online ? 'Online' : 'Offline'}
              </span>
              <span className="stat-sub">{bot?.online ? `uptime ${fmtUptime(bot.uptimeSeconds)}` : 'not responding'}</span>
            </div>
            <div className="card stat">
              <span className="stat-label">Servers</span>
              <span className="stat-value">{bot?.guilds ?? 0}</span>
              <span className="stat-sub">{bot?.users ?? 0} members reached</span>
            </div>
            <div className="card stat">
              <span className="stat-label">Latency</span>
              <span className="stat-value">{bot?.ping ?? 0}<small>ms</small></span>
              <span className="stat-sub">gateway round-trip</span>
            </div>
            <div className="card stat">
              <span className="stat-label">Memory</span>
              <span className="stat-value">{data.system.memoryUsage.rss}<small>MB</small></span>
              <span className="stat-sub">
                heap {data.system.memoryUsage.heapUsed}/{data.system.memoryUsage.heapTotal} MB · cpu {data.system.cpuUsage}%
              </span>
            </div>
          </section>

          <section className="grid main-grid">
            <div className="card now-playing">
              <div className="card-head">
                <div className="card-head-text">
                  <h2>Now Playing</h2>
                  {data.guild && (
                    <span className="guild-line">
                      on <b>{data.guild.name}</b>
                      {data.guild.voiceChannel ? ` · #${data.guild.voiceChannel}` : ''}
                    </span>
                  )}
                </div>
                {np && <span className="chip">{fmtDuration(np.duration)}</span>}
              </div>

              {np ? (
                <>
                  <div className="np-body">
                    <div className="np-art" aria-hidden>
                      ♪
                    </div>
                    <div className="np-meta">
                      <strong>{np.title}</strong>
                      <span>{np.artist}</span>
                      <span className="requested">
                        requested by <b>{np.requestedBy.username}</b>
                      </span>
                    </div>
                  </div>
                  <div className="progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="progress-times">
                    <span>{fmtDuration(np.position ?? 0)}</span>
                    <span>{fmtDuration(np.duration)}</span>
                  </div>
                </>
              ) : (
                <p className="empty">Nothing playing right now.</p>
              )}
            </div>

            <div className="card queue">
              <div className="card-head">
                <div className="card-head-text">
                  <h2>Queue</h2>
                  {data.guild && (
                    <span className="guild-line">
                      for <b>{data.guild.name}</b>
                    </span>
                  )}
                </div>
                <span className="chip">{data.queue.length} upcoming</span>
              </div>

              {data.queue.length === 0 ? (
                <p className="empty">Queue is empty.</p>
              ) : (
                <ol className="queue-list">
                  {data.queue.map((t, i) => (
                    <li key={`${t.title}-${i}`}>
                      <span className="q-index">{i + 1}</span>
                      <span className="q-meta">
                        <strong>{t.title}</strong>
                        <span>{t.artist}</span>
                      </span>
                      <span className="q-requester">
                        <Avatar username={t.requestedBy.username} />
                      </span>
                      <span className="q-duration">{fmtDuration(t.duration)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>

          <footer className="footer">
            <span>
              {data.system.nodeVersion} · {data.system.platform} · auto-refresh every {REFRESH_MS / 1000}s
            </span>
            <span>
              source: <b>{data.source}</b> · updated {new Date(data.updatedAt).toLocaleTimeString()}
            </span>
          </footer>
        </>
      )}
    </div>
  );
}
