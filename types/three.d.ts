import { Mesh } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      primitive: any;
    }
  }
}