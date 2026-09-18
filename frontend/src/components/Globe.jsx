import { useEffect, useRef } from "react";
import * as THREE from "three";

function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) return;

    // =========================
    // SCENE
    // =========================

    const scene = new THREE.Scene();

    // =========================
    // CAMERA
    // =========================

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 5.2);

    // =========================
    // RENDERER
    // =========================

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // IMPORTANT: transparent canvas
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);

    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.display = "block";

    container.appendChild(renderer.domElement);

    // =========================
    // LIGHTS
    // =========================

    const ambientLight = new THREE.AmbientLight(
      0x8abfff,
      0.55
    );

    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      0xffffff,
      2.2
    );

    sunLight.position.set(
      4,
      2,
      5
    );

    scene.add(sunLight);

    // =========================
    // EARTH
    // =========================

    const textureLoader = new THREE.TextureLoader();

    const earthTexture =
      textureLoader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"
      );

    earthTexture.colorSpace =
      THREE.SRGBColorSpace;

    const earthGeometry =
      new THREE.SphereGeometry(
        1.35,
        96,
        96
      );

    const earthMaterial =
      new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 18,
        specular: new THREE.Color(
          0x224466
        ),
      });

    const earth =
      new THREE.Mesh(
        earthGeometry,
        earthMaterial
      );

    scene.add(earth);

    // =========================
    // ATMOSPHERE
    // =========================

    const atmosphereGeometry =
      new THREE.SphereGeometry(
        1.41,
        96,
        96
      );

    const atmosphereMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x32c9ff,
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide,
      });

    const atmosphere =
      new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
      );

    scene.add(atmosphere);

    // =========================
    // OUTER GLOW
    // =========================

    const glowGeometry =
      new THREE.SphereGeometry(
        1.47,
        64,
        64
      );

    const glowMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x159dd5,
        transparent: true,
        opacity: 0.035,
        side: THREE.BackSide,
      });

    const glow =
      new THREE.Mesh(
        glowGeometry,
        glowMaterial
      );

    scene.add(glow);

    // =========================
    // ORBIT RINGS
    // =========================

    const orbitMaterial =
      new THREE.LineBasicMaterial({
        color: 0x159ed2,
        transparent: true,
        opacity: 0.22,
      });

    const orbit1 =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          2.05,
          0.006,
          16,
          160
        ),
        orbitMaterial
      );

    orbit1.rotation.x =
      THREE.MathUtils.degToRad(62);

    orbit1.rotation.z =
      THREE.MathUtils.degToRad(20);

    scene.add(orbit1);

    const orbit2 =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          2.15,
          0.005,
          16,
          160
        ),
        orbitMaterial
      );

    orbit2.rotation.x =
      THREE.MathUtils.degToRad(72);

    orbit2.rotation.y =
      THREE.MathUtils.degToRad(35);

    scene.add(orbit2);

    // =========================
    // MOUSE CONTROLS
    // =========================

    let isDragging = false;

    let previousMouseX = 0;
    let previousMouseY = 0;

    let rotationVelocity = 0;

    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerDown = (event) => {
      isDragging = true;

      previousMouseX = event.clientX;
      previousMouseY = event.clientY;

      container.style.cursor = "grabbing";
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;

      const deltaX =
        event.clientX - previousMouseX;

      const deltaY =
        event.clientY - previousMouseY;

      targetRotationY +=
        deltaX * 0.006;

      targetRotationX +=
        deltaY * 0.003;

      targetRotationX = THREE.MathUtils.clamp(
        targetRotationX,
        -0.7,
        0.7
      );

      rotationVelocity =
        deltaX * 0.0008;

      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;

      container.style.cursor = "grab";
    };

    // =========================
    // ZOOM
    // =========================

    let targetCameraZ = 5.2;

    const onWheel = (event) => {
      event.preventDefault();

      targetCameraZ +=
        event.deltaY * 0.002;

      targetCameraZ =
        THREE.MathUtils.clamp(
          targetCameraZ,
          3.1,
          6
        );
    };

    container.addEventListener(
      "pointerdown",
      onPointerDown
    );

    window.addEventListener(
      "pointermove",
      onPointerMove
    );

    window.addEventListener(
      "pointerup",
      onPointerUp
    );

    container.addEventListener(
      "wheel",
      onWheel,
      { passive: false }
    );

    // =========================
    // RESIZE
    // =========================

    const resize = () => {
      if (!container) return;

      const width =
        container.clientWidth;

      const height =
        container.clientHeight;

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height
      );
    };

    window.addEventListener(
      "resize",
      resize
    );

    // =========================
    // ANIMATION
    // =========================

    let animationFrame;

    const animate = () => {
      animationFrame =
        requestAnimationFrame(animate);

      // Automatic rotation
      if (!isDragging) {
        targetRotationY += 0.0018;
      }

      // Drag momentum
      if (!isDragging) {
        targetRotationY +=
          rotationVelocity;

        rotationVelocity *= 0.95;
      }

      // Smooth rotation
      earth.rotation.y +=
        (targetRotationY -
          earth.rotation.y) *
        0.08;

      earth.rotation.x +=
        (targetRotationX -
          earth.rotation.x) *
        0.08;

      // Atmosphere follows Earth
      atmosphere.rotation.y =
        earth.rotation.y;

      atmosphere.rotation.x =
        earth.rotation.x;

      glow.rotation.y =
        earth.rotation.y;

      glow.rotation.x =
        earth.rotation.x;

      // Smooth zoom
      camera.position.z +=
        (targetCameraZ -
          camera.position.z) *
        0.08;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // =========================
    // CLEANUP
    // =========================

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        onPointerMove
      );

      window.removeEventListener(
        "pointerup",
        onPointerUp
      );

      container.removeEventListener(
        "pointerdown",
        onPointerDown
      );

      container.removeEventListener(
        "wheel",
        onWheel
      );

      earthGeometry.dispose();
      earthMaterial.dispose();

      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();

      glowGeometry.dispose();
      glowMaterial.dispose();

      orbit1.geometry.dispose();
      orbit1.material.dispose();

      orbit2.geometry.dispose();
      orbit2.material.dispose();

      renderer.dispose();

      if (
        renderer.domElement &&
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="globe-wrapper"
    />
  );
}

export default Globe;