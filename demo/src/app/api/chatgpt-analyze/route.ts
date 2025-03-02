import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { data } = await request.json();

    // ChatGPT API のエンドポイントと API キーは環境変数から取得
    const apiKey = process.env.CHATGPT_API_KEY;
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const prompt = `
これは Web サイトの内部リンク構造データです:
${JSON.stringify(data, null, 2)}
上記のデータを元に、このサイトの特徴と構造について簡潔に説明してください。
`;

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });
    
    const apiData = await apiResponse.json();
    const analysis = apiData.choices?.[0]?.message?.content || '解析結果が得られませんでした。';

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ analysis: '解析エラーが発生しました。' }, { status: 500 });
  }
}
