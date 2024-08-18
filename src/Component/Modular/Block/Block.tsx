import { Euler } from "@react-three/fiber";
import { BoxGeometry, MeshStandardMaterial } from "three";

const boxGeometry = new BoxGeometry(1, 1, 1);
const floor1Material = new MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new MeshStandardMaterial({ color: "slategrey" });

export type BlockProps = {
  size?: [x: number, y: number, z: number];
  position?: [x: number, y: number, z: number];
  rotation?: Euler;
  type?: "floor1" | "floor2" | "obstacle" | "wall";
};

export default function Block({
  size = [4, 0.2, 4],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  type = "floor1",
}: BlockProps) {
  let material = floor1Material;
  switch (type) {
    case "floor2":
      material = floor2Material;
      break;
    case "obstacle":
      material = obstacleMaterial;
      break;
    case "wall":
      material = wallMaterial;
      break;

    // as we already assign material to floor1Material, we can ignore this case
    case "floor1":
    default:
      break;
  }

  return (
    <group receiveShadow position={position} rotation={rotation}>
      <mesh
        geometry={boxGeometry}
        scale={size}
        receiveShadow
        position={[0, -0.1, 0]}
        material={material}
      />
    </group>
  );
}
