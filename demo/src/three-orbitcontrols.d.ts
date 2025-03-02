declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher, MOUSE, TOUCH, Vector2, Vector3 } from 'three';
  
    export class OrbitControls extends EventDispatcher {
      constructor(object: Camera, domElement?: HTMLElement);
      object: Camera;
      domElement: HTMLElement | undefined;
      enabled: boolean;
      target: Vector3;
      minDistance: number;
      maxDistance: number;
      minZoom: number;
      maxZoom: number;
      minPolarAngle: number;
      maxPolarAngle: number;
      minAzimuthAngle: number;
      maxAzimuthAngle: number;
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      zoomSpeed: number;
      enableRotate: boolean;
      rotateSpeed: number;
      enablePan: boolean;
      panSpeed: number;
      screenSpacePanning: boolean;
      keyPanSpeed: number;
      autoRotate: boolean;
      autoRotateSpeed: number;
      keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number };
      mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
      touches: { ONE: TOUCH; TWO: TOUCH };
  
      update(): boolean;
      reset(): void;
      dispose(): void;
    }
  }
  