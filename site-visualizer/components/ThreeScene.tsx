'use client';

import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { Color } from 'three';

interface DetectedTech {
  name: string;
  category: string;
}

type ThreeSceneProps = {
  detectedList: string[]; // APIが返す ['WordPress','Laravel','Vercel',...]
};

// カテゴリとカラーの対応を拡張
const categoryColorMap: Record<string, string> = {
  CMS: '#1E90FF',
  Framework: '#FFA500',
  Frontend: '#ADFF2F',
  Language: '#EE82EE',
  Hosting: '#32CD32',
  default: '#808080',
};

// name -> category 変換の一例 (patterns.ts と同じ区分をこちらにも定義)
const nameToCategoryMap: Record<string, string> = {
  WordPress: 'CMS',
  Drupal: 'CMS',
  Joomla: 'CMS',
  Shopify: 'CMS',
  'Ruby on Rails': 'Framework',
  Django: 'Framework',
  Laravel: 'Framework',
  'ASP.NET': 'Framework',
  Flask: 'Framework',
  React: 'Frontend',
  Vue: 'Frontend',
  Angular: 'Frontend',
  Gatsby: 'Frontend',
  'Nuxt.js': 'Frontend',
  Svelte: 'Frontend',
  TypeScript: 'Language',
  'Node.js': 'Language',
  Netlify: 'Hosting',
  'GitHub Pages': 'Hosting',
  Heroku: 'Hosting',
  Vercel: 'Hosting',
  'Cloudflare Pages': 'Hosting',
};

export default function ThreeScene({ detectedList }: ThreeSceneProps) {
  // 1) name + category の配列を作る
  const detectedTechArray: DetectedTech[] = useMemo(() => {
    return detectedList.map((techName) => {
      const cat = nameToCategoryMap[techName] || 'default';
      return { name: techName, category: cat };
    });
  }, [detectedList]);

  // 2) カテゴリ別に並べる
  const boxes = useMemo(() => {
    const byCategory: Record<string, DetectedTech[]> = {};
    detectedTechArray.forEach((t) => {
      if (!byCategory[t.category]) {
        byCategory[t.category] = [];
      }
      byCategory[t.category].push(t);
    });

    const allBoxes: { name: string; category: string; position: [number, number, number]; color: string }[] = [];
    const catKeys = Object.keys(byCategory);
    catKeys.forEach((cat, catIndex) => {
      const techs = byCategory[cat];
      techs.forEach((tech, i) => {
        const x = catIndex * 5;
        const z = i * 2;
        const color = categoryColorMap[cat] || categoryColorMap.default;
        allBoxes.push({
          name: tech.name,
          category: tech.category,
          position: [x, 0, z] as [number, number, number],
          color,
        });
      });
    });
    return allBoxes;
  }, [detectedTechArray]);

  return (
    <Canvas style={{ background: '#eee' }} camera={{ position: [0, 8, 15], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />

      {boxes.map((box, idx) => (
        <mesh key={idx} position={box.position}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color={new Color(box.color)} />
        </mesh>
      ))}
    </Canvas>
  );
}
