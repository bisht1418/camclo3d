import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useZoom from "../../components/dashboard/visualizer/Zoom";

const createCustomShaderMaterial = (
  texture,
  shadowTexture,
  properties,
  isBodyMesh,
  isBackgroundMesh
) => {
  if (isBodyMesh || isBackgroundMesh) {
    properties = {
      brightness: 1,
      contrast: 1,
      saturation: 1,
      exposure: 0,
      shadowStrength: 0,
      highlightImprovement: 0,
    };
  }

  return new THREE.ShaderMaterial({
    uniforms: {
      mainTex: { value: texture },
      shadowTex: { value: shadowTexture },
      brightness: { value: isBackgroundMesh ? properties.brightness : properties.brightness },
      contrast: { value: properties.contrast },
      saturation: { value: properties.saturation },
      exposure: { value: properties.exposure },
      shadowStrength: { value: properties.shadowStrength },
      highlightImprovement: { value: properties.highlightImprovement },
      opacity: { value: 1.0 },
    },

    vertexShader: `
    attribute vec2 uv1;
    varying vec2 vUv;
    varying vec2 vUv1;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
  
    void main() {
      vUv = uv;
      vUv1 = uv1;
      vNormal = normalMatrix * normal;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
    `,
    fragmentShader: `
    uniform sampler2D mainTex;
    uniform sampler2D shadowTex;
    uniform float brightness;
    uniform float contrast;
    uniform float saturation;
    uniform float exposure;
    uniform float shadowStrength;
    uniform float highlightImprovement;
    uniform float opacity;
    varying vec2 vUv;
    varying vec2 vUv1;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    vec3 adjustSaturation(vec3 color, float adjustment) {
      vec3 luminance = vec3(0.299, 0.587, 0.114);
      float luminanceValue = dot(color, luminance);
      return mix(vec3(luminanceValue), color, adjustment);
    }

    float calc_factors(float base_channel, float blend_channel, float ratio) {
      float multiply, screen, comp, result;
      multiply = 2.0 * base_channel * blend_channel;
      screen = 1.0 - 2.0 * (1.0 - base_channel) * (1.0 - blend_channel);
      comp = base_channel < 0.5 ? multiply : screen;
      result = comp * ratio + base_channel * (1.0 - ratio);
      return result;
    }

    vec3 blendOverlay(vec3 base, vec3 blend, float ratio) {
      vec3 result;
      result.r = calc_factors(base.r, blend.r, ratio);
      result.g = calc_factors(base.g, blend.g, ratio);
      result.b = calc_factors(base.b, blend.b, ratio);
      return result;
    }

    vec4 blendOverlayWithAlpha(vec4 base, vec4 blend) {
      float comp_alpha = base.a <= blend.a ? base.a * opacity : blend.a * opacity;
      float new_alpha = base.a + (1.0 - base.a) * comp_alpha;
      if (comp_alpha * new_alpha > 0.0) {
        float ratio = comp_alpha / new_alpha;
        vec3 base_rgb = base.rgb;
        vec3 blend_rgb = blend.rgb;
        vec3 result = blendOverlay(base_rgb, blend_rgb, ratio);
        return vec4(mix(base_rgb, result, shadowStrength), base.a);
      } else {
        return base;
      }
    }

    vec4 improveHighlights(vec4 shadows, float c) {
      vec4 improved_shadows = shadows;
      if (shadows.r > 0.5) {
        float ip = shadows.r;
        // Invert the effect by using (3.0 - c) instead of c
        float op = 2.0 * (3.0 - c) * ip * ip + (1.0 - 3.0 * (3.0 - c)) * ip + (3.0 - c);
        improved_shadows = vec4(op, op, op, shadows.a);
      }
      return improved_shadows;
    }

    void main() {
      vec4 texColor = texture2D(mainTex, vUv);
      vec4 shadowColor = texture2D(shadowTex, vUv1);
      
      // Apply inverted highlight improvement
      shadowColor = improveHighlights(shadowColor, highlightImprovement);
      
      vec4 blendedColor = blendOverlayWithAlpha(texColor, shadowColor);
      vec3 color = blendedColor.rgb;
      
      color *= brightness;
      color = (color - 0.5) * contrast + 0.5;
      color = adjustSaturation(color, saturation);
      color *= pow(2.0, exposure);
      
      gl_FragColor = vec4(color, texColor.a);
    }
    `,
    transparent: true,
  });
};

const loadModel = async (
  scene,
  config,
  properties,
  additionalInfo,
  currentModelIndex,
  setCameraFromGLTF
) => {
  const loader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  try {
    // Load textures (texture loading code remains the same)
    const texture = await textureLoader.loadAsync(config.textureUrl);
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;

    // Load sleeve texture if available
    let sleeveTexture;
    if (config.sleeveUrl) {
      sleeveTexture = await textureLoader
        .loadAsync(config.sleeveUrl)
        .catch((error) => {
          console.warn(
            `Failed to load sleeve texture: ${error.message}. Proceeding with main texture for sleeve.`
          );
          return null;
        });
      if (sleeveTexture) {
        sleeveTexture.encoding = THREE.sRGBEncoding;
        sleeveTexture.flipY = false;
      }
    }

    // Load shadow texture
    let shadowTexture;
    if (config.shadowTextureUrl) {
      shadowTexture = await textureLoader
        .loadAsync(config.shadowTextureUrl)
        .catch((error) => {
          console.warn(
            `Failed to load shadow texture: ${error.message}. Proceeding without shadow.`
          );
          return null;
        });
      if (shadowTexture) {
        shadowTexture.encoding = THREE.sRGBEncoding;
        shadowTexture.flipY = false;
      }
    }

    const gltf = await loader.loadAsync(config.modelUrl).catch((error) => {
      throw new Error(`Failed to load GLTF model: ${error.message}`);
    });

    // Extract camera from GLTF if available
    let gltfCamera = null;
    gltf.scene.traverse((child) => {
      if (child.isCamera) {
        gltfCamera = child;
      }
    });

    // If we found a camera in the GLTF and this is the primary model (first in modelConfigs)
    if (gltfCamera && currentModelIndex === 0) {
      // Clone the camera to preserve its original state
      const camera = gltfCamera.clone();

      // Set up camera properties
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Call the callback to update the camera in the parent component
      setCameraFromGLTF(camera);
    }

    const model = gltf.scene;
    model.traverse((child) => {
      console.log(child,"llll")
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const isBodyMesh = child.name.toLowerCase().includes("body" || "dsc_0159");
        const isBackgroundMesh = child.name.toLowerCase().includes("bg");
        const isSleeveMesh = child.name.toLowerCase().includes("sleeve");

        try {
          const meshTexture = isSleeveMesh && sleeveTexture ? sleeveTexture : texture;
          child.material = createCustomShaderMaterial(
            meshTexture,
            shadowTexture,
            properties,
            isBodyMesh,
            isBackgroundMesh
          );
        } catch (error) {
          console.error(`Failed to create shader material for mesh ${child.name}: ${error.message}`);
          child.material = new THREE.MeshBasicMaterial({ map: texture });
        }
      }
    });

    scene.add(model);
    return model;
  } catch (error) {
    console.error(`Failed to load model: ${error.message}`);
    throw error;
  }
};

export const useThreeScene = (
  refContainer,
  modelConfigs,
  properties,
  additionalInfo,
) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelsRef = useRef([]);
  const modelGroupRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Modified to work with perspective camera from GLTF
  useZoom(cameraRef, refContainer);

  // Scene setup effect
  useEffect(() => {
    if (!refContainer.current || sceneRef.current) return;

    sceneRef.current = new THREE.Scene();

    // Create a default perspective camera that will be replaced if GLTF camera is found
    cameraRef.current = new THREE.PerspectiveCamera(
      45,  // More standard FOV as default
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current.position.set(0, 0, 5);
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    rendererRef.current.setSize(
      refContainer.current.clientWidth,
      refContainer.current.clientHeight
    );
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current.outputEncoding = THREE.sRGBEncoding;
    refContainer.current.appendChild(rendererRef.current.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2).normalize();
    sceneRef.current.add(ambientLight, directionalLight);

    modelGroupRef.current = new THREE.Group();
    sceneRef.current.add(modelGroupRef.current);

    // Modified zoom handler for perspective camera
    const handleWheel = (event) => {
      event.preventDefault();
      if (modelGroupRef.current) {
        const zoomSpeed = 0.01;
        const zoomDelta = -event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
        modelGroupRef.current.scale.multiplyScalar(zoomDelta);

      }
    };

    refContainer.current.addEventListener("wheel", handleWheel);

    // Modified resize handler for perspective camera
    const handleResize = () => {
      if (!refContainer.current || !cameraRef.current || !rendererRef.current) return;

      const aspect = refContainer.current.clientWidth / refContainer.current.clientHeight;
      cameraRef.current.aspect = aspect;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        refContainer.current.clientWidth,
        refContainer.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      refContainer.current?.removeEventListener("wheel", handleWheel);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Callback to update camera from GLTF
  const setCameraFromGLTF = useCallback((camera) => {
    if (camera && cameraRef.current) {
      cameraRef.current = camera;
    }
  }, []);

  const loadModels = useCallback(async () => {
    if (!sceneRef.current || !modelGroupRef.current) return;

    setLoading(true);

    // Clear existing models
    while (modelGroupRef.current.children.length > 0) {
      const model = modelGroupRef.current.children[0];
      modelGroupRef.current.remove(model);
      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    }

    modelsRef.current = [];

    try {
      const newModels = await Promise.all(
        modelConfigs.map((config, index) =>
          loadModel(
            modelGroupRef.current,
            config,
            properties,
            additionalInfo,
            index,
            setCameraFromGLTF // Pass the camera update callback
          )
        )
      );
      modelsRef.current = newModels;
    } catch (error) {
      console.error("Failed to load models:", error);
    }

    setLoading(false);
  }, [modelConfigs]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  // Shader uniform updates remain the same...
  const updateShaderUniforms = useCallback((newProperties) => {
    modelsRef.current.forEach((model) => {
      model.traverse((child) => {
        if (child.isMesh && child.material.type === 'ShaderMaterial') {
          const isBodyMesh = child.name.toLowerCase().includes("body");
          const isBackgroundMesh = child.name.toLowerCase().includes("bg");

          if (!isBodyMesh && !isBackgroundMesh) {
            Object.entries(newProperties).forEach(([prop, value]) => {
              if (child.material.uniforms[prop]) {
                child.material.uniforms[prop].value = value;
              }
            });
          }
        }
      });
    });
  }, []);

  return {
    renderer: rendererRef.current,
    scene: sceneRef.current,
    camera: cameraRef.current,
    loading,
    updateShaderUniforms
  };
};
