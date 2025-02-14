import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import productData from "../../../utils/products.json";
import kurtaTemplate from "../../../utils/saree.json";

const createBackgroundMesh = (
  textureUrl,
  index,
  backgroundPosition,
  backgroundScale
) => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textureUrl);

  const aspect = window.innerWidth / window.innerHeight;
  const geometry = new THREE.PlaneGeometry(2 * aspect, 2);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    toneMapped: false,
  });

  const backgroundMesh = new THREE.Mesh(geometry, material);
  backgroundMesh.position.set(
    Number(backgroundPosition?.x),
    Number(backgroundPosition?.y),
    Number(backgroundPosition?.z)
  );
  backgroundMesh.scale.set(
    Number(backgroundScale?.x),
    Number(backgroundScale?.y),
    Number(backgroundScale?.z)
  );

  return backgroundMesh;
};

function useThreeScene(
  refContainer,
  initialTextures,
  index = 0,
  position,
  scale,
  backgroundPosition,
  backgroundScale
) {
  const modelRefs = useRef([]);
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    const sceneInit = new THREE.Scene();
    const aspect = 777 / 1000;

    // const backgroundMesh = createBackgroundMesh(
    //   kurtaTemplate[0]?.body_png,
    //   index,
    //   backgroundPosition,
    //   backgroundScale
    // );
    // sceneInit.add(backgroundMesh);

    const cameraInit = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      1,
      -1,
      0.1,
      1000
    );
    cameraInit.position.set(0, 0, 5);
    cameraInit.lookAt(0, 0, 0);

    const rendererInit = new THREE.WebGLRenderer({ antialias: true });
    rendererInit.setSize(777, 1000);
    rendererInit.setClearColor(new THREE.Color(0xffffff));
    rendererInit.outputColorSpace = THREE.LinearSRGBColorSpace;

    rendererInit.toneMapping = THREE.ACESFilmicToneMapping;
    rendererInit.toneMappingExposure = 6;

    if (refContainer.current) {
      refContainer.current.appendChild(rendererInit.domElement);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneInit.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2).normalize();
    sceneInit.add(directionalLight);

    setScene(sceneInit);
    setCamera(cameraInit);
    setRenderer(rendererInit);

    return () => {
      if (refContainer.current) {
        refContainer.current.removeChild(rendererInit.domElement);
      }
      rendererInit.dispose();
    };
  }, [
    refContainer,
    index,
    position,
    scale,
    backgroundPosition,
    backgroundScale,
  ]);

  const loadModel = (modelUrl, textureUrl, position, scale, rotate) => {
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(textureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (rotate) {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.x = 1;
        tex.repeat.y = -1;
      }
    });

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.dispose();

            const newMaterial = new THREE.MeshStandardMaterial({
              map: texture,
              color: 0xffffff,
              metalness: 0,
              roughness: 0.6,
              transparent: true,
              opacity: 1,
            });

            child.material = newMaterial;
          }
        });

        model.position.set(position.x, position.y, position.z);
        model.scale.set(scale.x, scale.y, scale.z);

        scene.add(model);
        modelRefs.current.push(model);
      },
      undefined,
      (error) => {
        console.error(
          `An error occurred while loading the GLB file (${modelUrl}):`,
          error
        );
      }
    );
  };

  const updateTextures = (textures) => {
    modelRefs.current.forEach((model, index) => {
      const textureLoader = new THREE.TextureLoader();
      const newTexture = textureLoader.load(textures[index], (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
      });

      model.traverse((child) => {
        if (child.isMesh) {
          child.material.map = newTexture;
          child.material.needsUpdate = true;
        }
      });
    });
  };

  useEffect(() => {
    if (scene && renderer && camera) {
      loadModel(
        kurtaTemplate[index]?.blouse_glb,
        "/shirt_textures/3.jpg",
        {
          x: 0,
          y: -0.7,
          z: 0,
        },
        {
          x: 0.45,
          y: 0.45,
          z: 2,
        }
      );
      loadModel(
        kurtaTemplate[index]?.blouse_glb,
        "/shirt_textures/3.jpg",
        {
          x: 0,
          y: -0.7,
          z: -2,
        },
        {
          x: 0.45,
          y: 0.45,
          z: -5,
        }
      );
      loadModel(
        kurtaTemplate[index]?.blouse_sleeves_glb,
        "/shirt_textures/2.jpg",
        {
          x: 0,
          y: -0.7,
          z: -2,
        },
        {
          x: 0.45,
          y: 0.45,
          z: 1,
        }
      );
      loadModel(
        kurtaTemplate[index]?.blouse_sleeves_glb,
        "/shirt_textures/2.jpg",
        {
          x: 0,
          y: -0.7,
          z: -2,
        },
        {
          x: 0.45,
          y: 0.45,
          z: -5,
        }
      );
      loadModel(
        kurtaTemplate[index]?.saree_glb,
        initialTextures,
        {
          x: 0,
          y: -0.7,
          z: 0,
        },
        {
          x: 0.45,
          y: 0.45,
          z: 0.5,
        }
      );
      loadModel(
        kurtaTemplate[index]?.saree_glb,
        initialTextures,
        {
          x: 0,
          y: -0.7,
          z: 0,
        },
        {
          x: 0.45,
          y: 0.45,
          z: -5,
        }
      );
      loadModel(
        kurtaTemplate[index]?.body_glb,
        kurtaTemplate[index]?.body_png,
        {
          x: 0,
          y: -0.7,
          z: 2,
        },
        {
          x: 0.45,
          y: 0.45,
          z: 0.5,
        },
        true
      );

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
      };

      const debounceResize = debounce(handleResize, 100);
      window.addEventListener("resize", debounceResize);

      return () => {
        window.removeEventListener("resize", debounceResize);
      };
    }
  }, [scene, renderer, camera, index]);

  return { updateTextures };
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function SareeTwo() {
  const refContainer = useRef(null);
  const [currentTextures, setCurrentTextures] = useState(
    productData[1]?.textures[0].layerImage || ""
  );
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(kurtaTemplate[index]?.position_01);
  const [scale, setScale] = useState(kurtaTemplate[index]?.scale_01);
  const [backgroundPosition, setBackgroundPosition] = useState(
    kurtaTemplate[index]?.background_position
  );
  const [backgroundScale, setBackgroundScale] = useState(
    kurtaTemplate[index]?.background_scale
  );

  const decimalChangeX = 0.01;
  const decimalChangeY = 0.01;
  const decimalChangeZ = 0.5;

  const { updateTextures } = useThreeScene(
    refContainer,
    currentTextures,
    index,
    position,
    scale,
    backgroundPosition,
    backgroundScale
  );

  useEffect(() => {
    // setPosition(kurtaTemplate[index]?.position_01);
    // setScale(kurtaTemplate[index]?.scale_01);
    // setBackgroundPosition(kurtaTemplate[index]?.background_position);
    // setBackgroundScale(kurtaTemplate[index]?.background_scale);
    updateTextures(currentTextures);
  }, [
    currentTextures,
    updateTextures,
    index,
    position,
    scale,
    backgroundPosition,
    backgroundScale,
  ]);

  const handleChangeModel = (value) => {
    setIndex(value);
  };

  const handlePositionChange = (axis, increment) => {
    setPosition((prev) => ({
      ...prev,
      [axis]: parseFloat((prev[axis] + increment).toFixed(3)),
    }));
  };

  const handleScaleChange = (axis, increment) => {
    setScale((prev) => ({
      ...prev,
      [axis]: parseFloat((prev[axis] + increment).toFixed(3)),
    }));
  };

  const handleBackgroundPositionChange = (axis, increment) => {
    setBackgroundPosition((prev) => ({
      ...prev,
      [axis]: parseFloat((prev[axis] + increment).toFixed(3)),
    }));
  };

  const handleBackgroundScaleChange = (axis, increment) => {
    setBackgroundScale((prev) => ({
      ...prev,
      [axis]: parseFloat((prev[axis] + increment).toFixed(3)),
    }));
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div
        ref={refContainer}
        style={{
          height: "100%",
          backgroundColor: "lightgray",
        }}
      ></div>
      <div className="w-full h-full bg-green-400">
        <div>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(0);
            }}
          >
            1
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(1);
            }}
          >
            2
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(2);
            }}
          >
            3
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(3);
            }}
          >
            4
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(4);
            }}
          >
            5
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(5);
            }}
          >
            6
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(6);
            }}
          >
            7
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(7);
            }}
          >
            8
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(8);
            }}
          >
            9
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(9);
            }}
          >
            10
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(10);
            }}
          >
            11
          </button>
          <button
            className="bg-[red] text-white p-[5px]"
            onClick={() => {
              handleChangeModel(11);
            }}
          >
            12
          </button>
        </div>
        <div className="bg-yellow-300">
          Controller
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handlePositionChange("x", decimalChangeX)}
            >
              Position X +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handlePositionChange("y", decimalChangeY)}
            >
              Position Y +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handlePositionChange("z", decimalChangeZ)}
            >
              Position Z +
            </button>
            <button className="font-bold">
              Position <span className="mr-3">{position?.x}</span>{" "}
              <span className="mr-3">{position?.y}</span>
              <span>{position?.z}</span>
            </button>
          </div>
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handlePositionChange("x", -decimalChangeX)}
            >
              Position X -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handlePositionChange("y", -decimalChangeY)}
            >
              Position Y -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handlePositionChange("z", -decimalChangeZ)}
            >
              Position Z -
            </button>
          </div>
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleScaleChange("x", decimalChangeX)}
            >
              Scale X +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleScaleChange("y", decimalChangeY)}
            >
              Scale Y +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleScaleChange("z", decimalChangeZ)}
            >
              Scale Z +
            </button>
            <button className="font-bold">
              scale <span className="mr-3">{scale?.x}</span>{" "}
              <span className="mr-3">{scale?.y}</span>
              <span>{scale?.z}</span>
            </button>
          </div>
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleScaleChange("x", -decimalChangeX)}
            >
              Scale X -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleScaleChange("y", -decimalChangeY)}
            >
              Scale Y -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleScaleChange("z", -decimalChangeZ)}
            >
              Scale Z -
            </button>
          </div>
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() =>
                handleBackgroundPositionChange("x", decimalChangeX)
              }
            >
              Back Position X +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() =>
                handleBackgroundPositionChange("y", decimalChangeY)
              }
            >
              Back Position Y +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() =>
                handleBackgroundPositionChange("z", decimalChangeZ)
              }
            >
              Back Position Z +
            </button>
            <button className="font-bold">
              backgroundPosition{" "}
              <span className="mr-3">{backgroundPosition?.x}</span>{" "}
              <span className="mr-3">{backgroundPosition?.y}</span>
              <span>{backgroundPosition?.z}</span>
            </button>
          </div>
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() =>
                handleBackgroundPositionChange("x", -decimalChangeX)
              }
            >
              Back Position X -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() =>
                handleBackgroundPositionChange("y", -decimalChangeY)
              }
            >
              Back Position Y -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() =>
                handleBackgroundPositionChange("z", -decimalChangeZ)
              }
            >
              Back Position Z -
            </button>
          </div>
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleBackgroundScaleChange("x", decimalChangeX)}
            >
              Back Scale X +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleBackgroundScaleChange("y", decimalChangeY)}
            >
              Back Scale Y +
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleBackgroundScaleChange("z", decimalChangeZ)}
            >
              Back Scale Z +
            </button>
            <button className="font-bold">
              backgroundScale <span className="mr-3">{backgroundScale?.x}</span>{" "}
              <span className="mr-3">{backgroundScale?.y}</span>
              <span>{backgroundScale?.z}</span>
            </button>
          </div>
          <div>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleBackgroundScaleChange("x", -decimalChangeX)}
            >
              Back Scale X -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleBackgroundScaleChange("y", -decimalChangeY)}
            >
              Back Scale Y -
            </button>
            <button
              className="border px-2 py-2 mr-2 text-white bg-black mb-2"
              onClick={() => handleBackgroundScaleChange("z", -decimalChangeZ)}
            >
              Back Scale Z -
            </button>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col gap-5 bg-gray-100 rounded-xl p-3 w-full h-full justify-center items-start">
        <div>
          <p className="text-2xl font-bold">Texture Color</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-5">
          {productData?.textures?.map((item, index) => (
            <div key={item.id}>
              <img
                onClick={() => {
                  const newTextures = [...currentTextures];
                  newTextures[index] = item.layerImage;
                  setCurrentTextures(newTextures);
                }}
                className="h-10 w-10 rounded-full cursor-pointer"
                src={item.layerImage}
                alt="texture"
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default SareeTwo;
