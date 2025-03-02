'use client';

import ChatGPTAnalysis from '@/components/ChatGPTAnalysis';
import ThreeDMap from '@/components/ThreeDMap';
import { useState, useEffect } from 'react';

export default function Home() {
  const [llmsData, setLlmsData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string>('');

  // 初回読み込み時にLLMs.txtを取得・解析
  useEffect(() => {
    fetch('/api/parse-llms')
      .then((res) => res.json())
      .then((data) => setLlmsData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">見えない設計図 Demo</h1>
      <p className="mb-8">
        LLMs.txt のデータを元に Web サイトの内部リンク構造を 3D 可視化し、ChatGPT API による解析も行います。
      </p>

      {llmsData ? (
        <>
          <ThreeDMap data={llmsData} />
          <ChatGPTAnalysis data={llmsData} analysis={analysis} setAnalysis={setAnalysis} />
        </>
      ) : (
        <p>LLMs.txt を解析中...</p>
      )}
    </div>
  );
}
