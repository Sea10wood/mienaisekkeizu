
'use client';

import { useState } from 'react';

interface ChatGPTAnalysisProps {
  data: Record<string, string[]>;
  analysis: string;
  setAnalysis: (analysis: string) => void;
}

export default function ChatGPTAnalysis({ data, analysis, setAnalysis }: ChatGPTAnalysisProps) {
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // ChatGPT API 呼び出し例（エンドポイントは適宜設定）
      const response = await fetch('/api/chatgpt-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });
      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      setAnalysis('解析に失敗しました。');
    }
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">ChatGPT によるサイト解析</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? '解析中...' : 'サイト解析を実行'}
      </button>
      {analysis && (
        <div className="p-4 bg-gray-50 border rounded">
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}
