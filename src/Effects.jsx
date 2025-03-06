import { useLoader } from "@react-three/fiber";
import { EffectComposer, SSR, Bloom, LUT } from "@react-three/postprocessing";
import { useControls } from "leva";
import { LUTCubeLoader } from "postprocessing";
import { useState } from "react";

export function Effects() {
  const texture = useLoader(LUTCubeLoader, "/F-6800-STD.cube");

  const [show, setShow] = useState(true);

  const { Effect, ...props } = useControls(
    show && {
      Effect: false,
    }
  );
  return (
    Effect && (
      <EffectComposer disableNormalPass>
        <SSR {...props} />
        <Bloom
          luminanceThreshold={0.2}
          mipmapBlur
          luminanceSmoothing={0}
          intensity={1.75}
        />
        <LUT lut={texture} />
      </EffectComposer>
    )
  );
}
