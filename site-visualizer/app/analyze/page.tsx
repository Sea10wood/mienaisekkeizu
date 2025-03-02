'use client';

import { FormEvent, useState } from 'react';
import ThreeScene from '../../components/ThreeScene';

export default function AnalyzePage() {
  const [inputUrl, setInputUrl] = useState('');
  const [detected, setDetected] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      if (data.frameworks) {
        setDetected(data.frameworks);
      }
    } catch (error) {
      console.error(error);
      alert('解析に失敗しました。');
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>URL解析</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="https://example.com"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ width: '300px', marginRight: '8px' }}
        />
        <button type="submit">解析</button>
      </form>

      {detected.length > 0 && (
        <>
          <h2>検出されたフレームワーク: {detected.join(', ')}</h2>
          <div style={{ width: '100%', height: '500px', marginTop: '20px' }}>
            <ThreeScene detectedList={detected} />
          </div>
        </>
      )}
    </main>
  );
}
