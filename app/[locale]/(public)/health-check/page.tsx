'use client';

import { useEffect, useState } from 'react';

export default function HealthCheck() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  useEffect(() => {
  const url = `${base}/api/health`;
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        setData(j);
      })
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Frontend → Backend health</h1>
      <p>
        Calling: <code>{base}/api/health</code>
      </p>
      {err && <pre style={{ color: 'crimson' }}>Error: {err}</pre>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {!data && !err && <p>Loading…</p>}
    </main>
  );
}
