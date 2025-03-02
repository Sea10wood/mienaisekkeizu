import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>3D Analyzer - トップページ</h1>
      <p>URL に含まれるフレームワークや CMS を判定して 3D 表示します。</p>
      <p>
        <Link href="/analyze">解析ページへ</Link>
      </p>
    </main>
  );
}
