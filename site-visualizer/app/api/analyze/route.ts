import { NextRequest, NextResponse } from 'next/server';
import { parse as parseCookie } from 'cookie';
import cheerio from 'cheerio';
import { PATTERNS, PatternDefinition } from './patterns';

// scriptタグ検索用のヘルパー関数
function matchScriptTags(html: string, scriptPatterns: string[]): boolean {
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
  let match;
  const lowers = scriptPatterns.map(p => p.toLowerCase());
  while ((match = scriptRegex.exec(html)) !== null) {
    const src = match[1].toLowerCase();
    for (const p of lowers) {
      if (src.includes(p)) {
        return true;
      }
    }
  }
  return false;
}

function detectTechnologies(params: {
  html: string;
  generatorTags: string[];
  headers: Record<string, string>;
  cookies: string[];
}): string[] {
  const found: string[] = [];

  const htmlLower = params.html.toLowerCase();
  const generatorLower = params.generatorTags.map(g => g.toLowerCase());
  // headersは {key: val} で小文字化済みの想定
  // cookiesは全て小文字化
  const cookieSet = new Set(params.cookies.map(c => c.toLowerCase()));

  PATTERNS.forEach((pattern: PatternDefinition) => {
    let matched = false;

    // 1) HTML
    if (!matched && pattern.match.html) {
      for (const str of pattern.match.html) {
        if (htmlLower.includes(str.toLowerCase())) {
          matched = true;
          break;
        }
      }
    }

    // 2) generatorタグ
    if (!matched && pattern.match.generator) {
      for (const gen of pattern.match.generator) {
        // generatorタグの値に含まれていれば
        if (generatorLower.some(gVal => gVal.includes(gen.toLowerCase()))) {
          matched = true;
          break;
        }
      }
    }

    // 3) headers
    if (!matched && pattern.match.headers) {
      for (const headerPattern of pattern.match.headers) {
        // headersの全valueを結合 or keyもチェックしたい場合は要工夫
        // ここでは value(キー:バリュー)両方を見る簡易例
        for (const [key, val] of Object.entries(params.headers)) {
          const combo = key + ':' + val; // 'server:cloudflare'など
          if (combo.includes(headerPattern.toLowerCase())) {
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
    }

    // 4) cookies
    if (!matched && pattern.match.cookies) {
      for (const cookiePattern of pattern.match.cookies) {
        if ([...cookieSet].some(c => c.includes(cookiePattern.toLowerCase()))) {
          matched = true;
          break;
        }
      }
    }

    // 5) script
    if (!matched && pattern.match.script) {
      if (matchScriptTags(params.html, pattern.match.script)) {
        matched = true;
      }
    }

    if (matched) {
      found.push(pattern.name);
    }
  });

  return found;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const res = await fetch(url, { redirect: 'follow' });
    const rawHtml = await res.text();

    // headers小文字化
    const headersObj: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      headersObj[key.toLowerCase()] = val.toLowerCase();
    });

    // cookie解析
    const setCookie = res.headers.get('set-cookie') || '';
    const rawCookies = setCookie.split(',');
    const cookieNames: string[] = [];
    rawCookies.forEach(c => {
      const parsed = parseCookie(c);
      for (const key of Object.keys(parsed)) {
        cookieNames.push(key.toLowerCase());
      }
    });

    // generatorタグを収集(cheerio)
    const $ = cheerio.load(rawHtml);
    const generatorTags: string[] = [];
    $('meta[name="generator"]').each((_: number, el: cheerio.Element) => {
      const val: string | undefined = $(el).attr('content');
      if (val) generatorTags.push(val);
    });

    // 判定実行
    const foundTech = detectTechnologies({
      html: rawHtml,
      generatorTags,
      headers: headersObj,
      cookies: cookieNames,
    });

    return NextResponse.json({ frameworks: foundTech });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
