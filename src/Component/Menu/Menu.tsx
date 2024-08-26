import { Canvas } from "@react-three/fiber";
import Musketeer from "../Model/Musketeer/Musketeer";
import { OrbitControls, Sparkles, SpotLight } from "@react-three/drei";
import Chest from "../Model/Chest/Chest";

const Menu = () => {
  return (
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-0.5, 0, -2.2],
      }}
    >
      <OrbitControls makeDefault />

      <group position={[-1.1, -0.4, -0.5]} rotation={[0, -Math.PI / 18, 0]}>
        <ambientLight intensity={1} />

        <SpotLight
          position={[0, 3, 0]}
          angle={0.8}
          distance={20}
          attenuation={3.5}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <Chest
          isOpen={true}
          rotation={[0, Math.PI, 0]}
          scale={0.2}
          position={[0.8, 0, 0]}
        />

        <Musketeer position={[0.3, 0, 0]} />
        <Sparkles
          position={[0.8, 0.5, 0]}
          speed={0.7}
          scale={1.5}
          color={"red"}
        />
        <Sparkles
          position={[0.8, 0.5, 0]}
          speed={0.7}
          scale={1.9}
          color={"yellow"}
          count={20}
        />
      </group>
    </Canvas>
  );
};

export default Menu;
