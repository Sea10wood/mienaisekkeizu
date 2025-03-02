'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeDMapProps {
  data: Record<string, string[]>;
}

interface Node {
  id: string;
  position: THREE.Vector3;
}

interface Edge {
  from: string;
  to: string;
}

export default function ThreeDMap({ data }: ThreeDMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // シーン、カメラ、レンダラーの初期化
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    // renderer.domElement.style.pointerEvents = 'auto'; // 既定値
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls の追加
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // 照明の追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // ノードとエッジのデータ生成
    const nodesMap: Record<string, Node> = {};
    const edges: Edge[] = [];
    const roomMeshes: Record<string, THREE.Mesh> = {};

    // ルート 'home' を起点に BFS で各ノードのレベルを決定
    const root = 'home';
    const visited = new Set<string>();
    const queue: { id: string; level: number }[] = [];
    queue.push({ id: root, level: 0 });
    visited.add(root);

    const levelSpacing = 10;
    const roomWidth = 3;   // 部屋の横幅
    const roomHeight = 2.5; // 部屋の高さ
    const roomDepth = 3;   // 部屋の奥行き
    const levelNodes: Record<number, string[]> = {};

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (!levelNodes[level]) levelNodes[level] = [];
      levelNodes[level].push(id);

      if (data[id]) {
        for (const child of data[id]) {
          edges.push({ from: id, to: child });
          if (!visited.has(child)) {
            visited.add(child);
            queue.push({ id: child, level: level + 1 });
          }
        }
      }
    }
    // data にキーとして存在しない子ノードをレベル 1 に追加
    for (const key in data) {
      for (const child of data[key]) {
        if (!visited.has(child)) {
          visited.add(child);
          if (!levelNodes[1]) levelNodes[1] = [];
          levelNodes[1].push(child);
        }
      }
    }

    // 各レベルごとに、ノード（部屋）を円形に配置
    for (const levelStr in levelNodes) {
      const level = parseInt(levelStr);
      const ids = levelNodes[level];
      const angleStep = (2 * Math.PI) / ids.length;
      const radius = (level + 1) * levelSpacing;
      ids.forEach((id, index) => {
        const angle = index * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        // 部屋に奥行き感を与えるためランダムな z オフセットを付与
        const z = -level * levelSpacing + (Math.random() - 0.5) * 2;
        nodesMap[id] = {
          id,
          position: new THREE.Vector3(x, y, z)
        };
      });
    }

    // 部屋（ノード）の生成：博物館風の落ち着いた色調に変更
    const roomGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth);
    const roomMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee, // 薄いグレー
      opacity: 0.95,
      transparent: true
    });
    Object.values(nodesMap).forEach((node) => {
      const room = new THREE.Mesh(roomGeometry, roomMaterial);
      room.position.copy(node.position);
      // userData にファイル情報（ここでは id をファイル名と仮定）
      room.userData = { type: 'room', file: node.id };
      scene.add(room);
      roomMeshes[node.id] = room;
    });

    // 廊下（エッジ）の生成：部屋の中心から、部屋の奥行き分だけずらして接続
    const createCorridor = (start: THREE.Vector3, end: THREE.Vector3) => {
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const newStart = new THREE.Vector3().copy(start).add(direction.clone().multiplyScalar(roomDepth / 2));
      const newEnd = new THREE.Vector3().copy(end).add(direction.clone().multiplyScalar(-roomDepth / 2));
      const corridorLength = newStart.distanceTo(newEnd);

      const corridorGeometry = new THREE.BoxGeometry(corridorLength, 0.5, 0.5);
      const corridorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const corridor = new THREE.Mesh(corridorGeometry, corridorMaterial);

      const midPoint = new THREE.Vector3().addVectors(newStart, newEnd).multiplyScalar(0.5);
      corridor.position.copy(midPoint);
      corridor.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
      return { corridor, newStart, newEnd };
    };

    edges.forEach((edge) => {
      const fromNode = nodesMap[edge.from];
      const toNode = nodesMap[edge.to];
      if (fromNode && toNode) {
        const { corridor } = createCorridor(fromNode.position, toNode.position);
        corridor.userData = { type: 'corridor', from: edge.from, to: edge.to };
        scene.add(corridor);
      }
    });

    // 入口の追加：'home' の部屋にドアを追加（ドアは木目調の茶色）
    if (roomMeshes['home']) {
      const doorWidth = 1;
      const doorHeight = 1.8;
      const doorDepth = 0.2;
      const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
      const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
      // ドアを 'home' 部屋の -Z 側中央に配置（部屋の内側にくるように調整）
      doorMesh.position.set(0, - (roomHeight - doorHeight) / 2, - (roomDepth / 2 + doorDepth / 2));
      roomMeshes['home'].add(doorMesh);
    }

    // 床面の追加（オプション：大理石調などをイメージ）
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -10;
    scene.add(floor);

    // ポップアップ表示用の関数
    const showPopup = (message: string, x: number, y: number) => {
      const popup = document.createElement('div');
      popup.style.position = 'fixed';
      popup.style.background = 'rgba(255,255,255,0.95)';
      popup.style.border = '1px solid #333';
      popup.style.padding = '8px';
      popup.style.borderRadius = '4px';
      popup.style.pointerEvents = 'none';
      popup.style.left = `${x + 10}px`;
      popup.style.top = `${y + 10}px`;
      popup.style.zIndex = '1000';
      popup.innerText = message;
      document.body.appendChild(popup);
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 3000);
    };

    // クリックおよびタッチイベントによる情報表示
    const raycaster = new THREE.Raycaster();
    const handleInteraction = (clientX: number, clientY: number) => {
      const rect = mountRef.current!.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.type) {
          let message = '';
          if (obj.userData.type === 'room') {
            message = `ファイル: ${obj.userData.file}`;
          } else if (obj.userData.type === 'corridor') {
            message = `移動経路: ${obj.userData.from} → ${obj.userData.to}`;
          }
          showPopup(message, clientX, clientY);
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      handleInteraction(event.clientX, event.clientY);
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        handleInteraction(touch.clientX, touch.clientY);
      }
    };

    // イベントリスナーを mountRef.current に設定
    mountRef.current.addEventListener('click', onClick);
    mountRef.current.addEventListener('touchend', onTouchEnd);

    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // クリーンアップ
    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener('click', onClick);
        mountRef.current.removeEventListener('touchend', onTouchEnd);
      }
      renderer.dispose();
      while (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">3D サイトマップ（博物館風・ドア付き）</h2>
      <div ref={mountRef} className="w-full h-96 bg-gray-100" />
    </div>
  );
}
