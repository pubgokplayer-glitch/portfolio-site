import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function ExplodedDumbbell() {
  const webglRef = useRef(null);

  useEffect(() => {
    const container = webglRef.current;
    if (!container) return;

    // ── Three.js Scene Setup ─────────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.35, 9.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // Critical for mobile: ensure canvas allows vertical page scrolling
    renderer.domElement.style.touchAction = "pan-y";
    container.appendChild(renderer.domElement);

    // Studio Environment Map for Chrome & Matte Black
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // OrbitControls for 360° mouse drag on desktop
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enableZoom = false; // Never hijack page scrolling
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minPolarAngle = Math.PI * 0.15;

    // On mobile touchscreens, disable OrbitControls' touch capture so vertical page scroll is 100% free
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      controls.touches = { ONE: THREE.TOUCH.NONE, TWO: THREE.TOUCH.NONE };
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    const d = 5.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // Dynamic 7-color spectrum point lights following cursor
    const cursorLight1 = new THREE.PointLight(0xff0055, 6, 9);
    const cursorLight2 = new THREE.PointLight(0x00d4ff, 5, 9);
    scene.add(cursorLight1, cursorLight2);

    // Soft ground shadow receiver plane on white floor
    const shadowPlaneGeo = new THREE.PlaneGeometry(24, 24);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.11 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.75;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // ── Procedural Textures ──────────────────────────────────────────────
    function createKnurlBumpMap() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      const step = 16;
      for (let i = -512; i < 1024; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 512, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i + 512, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(14, 4);
      return tex;
    }

    function createPlateFaceTexture(topText, bottomText, weightKg) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#121214";
      ctx.fillRect(0, 0, 1024, 1024);

      const cx = 512,
        cy = 512;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 3;
      for (let r = 140; r < 470; r += 18) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 435, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 250, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = "#f5f5f7";
      ctx.font = "800 44px Montserrat, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(topText, 0, -335);

      ctx.fillStyle = "#e11d48";
      ctx.font = "700 32px 'JetBrains Mono', monospace";
      ctx.fillText(weightKg, 0, 340);

      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "600 22px 'JetBrains Mono', monospace";
      ctx.fillText(bottomText, 0, 285);
      ctx.restore();

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 8;
      return tex;
    }

    const knurlTexture = createKnurlBumpMap();
    const outerPlateTex = createPlateFaceTexture(
      "AWAIS CHOHAN",
      "DISCIPLINE // SPEC",
      "10 KG"
    );
    const innerPlateTex = createPlateFaceTexture(
      "AESTHETIC ENG.",
      "HYPERTROPHY // PRO",
      "5 KG"
    );

    // ── Materials ────────────────────────────────────────────────────────
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      metalness: 1.0,
      roughness: 0.07,
      envMapIntensity: 1.8,
    });

    const knurledChromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.95,
      roughness: 0.28,
      bumpMap: knurlTexture,
      bumpScale: 0.018,
      envMapIntensity: 1.4,
    });

    const matteBlackMaterial = new THREE.MeshStandardMaterial({
      color: 0x141416,
      metalness: 0.45,
      roughness: 0.62,
      envMapIntensity: 0.9,
    });

    const outerPlateFaceMat = new THREE.MeshStandardMaterial({
      map: outerPlateTex,
      metalness: 0.5,
      roughness: 0.48,
      envMapIntensity: 1.0,
    });

    const innerPlateFaceMat = new THREE.MeshStandardMaterial({
      map: innerPlateTex,
      metalness: 0.5,
      roughness: 0.48,
      envMapIntensity: 1.0,
    });

    const anodizedRedMaterial = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      metalness: 0.75,
      roughness: 0.22,
      envMapIntensity: 1.5,
    });

    // ── Dumbbell Geometry ────────────────────────────────────────────────
    const dumbbellGroup = new THREE.Group();
    scene.add(dumbbellGroup);

    function createWeightPlate(radius, thickness, faceMaterial) {
      const group = new THREE.Group();

      const profile = [
        new THREE.Vector2(0.28, -thickness / 2),
        new THREE.Vector2(radius - 0.06, -thickness / 2),
        new THREE.Vector2(radius, -thickness / 2 + 0.05),
        new THREE.Vector2(radius, thickness / 2 - 0.05),
        new THREE.Vector2(radius - 0.06, thickness / 2),
        new THREE.Vector2(0.28, thickness / 2),
      ];
      const latheGeo = new THREE.LatheGeometry(profile, 64);
      latheGeo.rotateZ(Math.PI / 2);
      const plateMesh = new THREE.Mesh(latheGeo, matteBlackMaterial);
      plateMesh.castShadow = true;
      plateMesh.receiveShadow = true;
      group.add(plateMesh);

      const discGeo = new THREE.CircleGeometry(radius - 0.065, 64);
      const discOut = new THREE.Mesh(discGeo, faceMaterial);
      discOut.rotation.y = Math.PI / 2;
      discOut.position.x = thickness / 2 + 0.002;
      group.add(discOut);

      const discIn = new THREE.Mesh(discGeo, faceMaterial);
      discIn.rotation.y = -Math.PI / 2;
      discIn.position.x = -thickness / 2 - 0.002;
      group.add(discIn);

      const rimGeo = new THREE.CylinderGeometry(
        radius + 0.003,
        radius + 0.003,
        thickness * 0.28,
        64,
        1,
        true
      );
      rimGeo.rotateZ(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, chromeMaterial);
      group.add(rimMesh);

      const hubGeo = new THREE.CylinderGeometry(0.36, 0.36, thickness + 0.02, 32);
      hubGeo.rotateZ(Math.PI / 2);
      const hubMesh = new THREE.Mesh(hubGeo, chromeMaterial);
      group.add(hubMesh);

      return group;
    }

    // Handle + Sleeves
    const handleGroup = new THREE.Group();
    dumbbellGroup.add(handleGroup);

    const gripPoints = [];
    const gripSegments = 40;
    const gripHalfLen = 0.88;
    for (let i = 0; i <= gripSegments; i++) {
      const t = i / gripSegments;
      const y = (t - 0.5) * (gripHalfLen * 2);
      const swell = Math.cos((t - 0.5) * Math.PI) * 0.032;
      gripPoints.push(new THREE.Vector2(0.185 + swell, y));
    }
    const gripGeo = new THREE.LatheGeometry(gripPoints, 48);
    gripGeo.rotateZ(Math.PI / 2);
    const gripMesh = new THREE.Mesh(gripGeo, knurledChromeMaterial);
    gripMesh.castShadow = true;
    handleGroup.add(gripMesh);

    [-0.62, 0.62].forEach((xPos) => {
      const bandGeo = new THREE.CylinderGeometry(0.205, 0.205, 0.06, 48);
      bandGeo.rotateZ(Math.PI / 2);
      const band = new THREE.Mesh(bandGeo, chromeMaterial);
      band.position.x = xPos;
      handleGroup.add(band);

      const redRingGeo = new THREE.CylinderGeometry(0.208, 0.208, 0.022, 48);
      redRingGeo.rotateZ(Math.PI / 2);
      const redRing = new THREE.Mesh(redRingGeo, anodizedRedMaterial);
      redRing.position.x = xPos > 0 ? xPos - 0.04 : xPos + 0.04;
      handleGroup.add(redRing);
    });

    [-0.96, 0.96].forEach((xPos) => {
      const flangeGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 48);
      flangeGeo.rotateZ(Math.PI / 2);
      const flange = new THREE.Mesh(flangeGeo, chromeMaterial);
      flange.position.x = xPos;
      flange.castShadow = true;
      handleGroup.add(flange);
    });

    [-1.75, 1.75].forEach((xPos) => {
      const sleeveGeo = new THREE.CylinderGeometry(0.26, 0.26, 1.55, 48);
      sleeveGeo.rotateZ(Math.PI / 2);
      const sleeve = new THREE.Mesh(sleeveGeo, chromeMaterial);
      sleeve.position.x = xPos;
      sleeve.castShadow = true;
      handleGroup.add(sleeve);

      for (let k = -0.65; k <= 0.65; k += 0.07) {
        const threadGeo = new THREE.TorusGeometry(0.262, 0.012, 12, 36);
        threadGeo.rotateY(Math.PI / 2);
        const thread = new THREE.Mesh(threadGeo, chromeMaterial);
        thread.position.x = xPos + k;
        handleGroup.add(thread);
      }
    });

    // Weight Plates (Permanently Assembled at resting positions)
    const plateInnerL = createWeightPlate(1.38, 0.34, innerPlateFaceMat);
    const plateInnerR = createWeightPlate(1.38, 0.34, innerPlateFaceMat);
    const plateOuterL = createWeightPlate(1.18, 0.28, outerPlateFaceMat);
    const plateOuterR = createWeightPlate(1.18, 0.28, outerPlateFaceMat);

    plateInnerL.position.x = -1.24;
    plateInnerR.position.x = 1.24;
    plateOuterL.position.x = -1.58;
    plateOuterR.position.x = 1.58;

    dumbbellGroup.add(plateInnerL, plateInnerR, plateOuterL, plateOuterR);

    // Spinlock Collars (Permanently Assembled)
    function createSpinlockCollar() {
      const collarGroup = new THREE.Group();
      const mainGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.22, 12);
      mainGeo.rotateZ(Math.PI / 2);
      const mainMesh = new THREE.Mesh(mainGeo, chromeMaterial);
      mainMesh.castShadow = true;
      collarGroup.add(mainMesh);

      const redSealGeo = new THREE.CylinderGeometry(0.49, 0.49, 0.045, 48);
      redSealGeo.rotateZ(Math.PI / 2);
      const redSeal = new THREE.Mesh(redSealGeo, anodizedRedMaterial);
      collarGroup.add(redSeal);

      return collarGroup;
    }

    const collarL = createSpinlockCollar();
    const collarR = createSpinlockCollar();
    collarL.position.x = -1.88;
    collarR.position.x = 1.88;
    dumbbellGroup.add(collarL, collarR);

    // ── Initial 3/4 Dynamic Diagonal Camera Angle ────────────────────────
    dumbbellGroup.rotation.y = -0.65;
    dumbbellGroup.rotation.x = 0.22;

    // ── Responsive Scaling Function (Mobile vs Desktop) ───────────────────
    function updateResponsiveDimensions() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // On mobile screens, scale the dumbbell so it fits cleanly with comfortable margins
      if (isMobile) {
        // Fits perfectly on screens from 320px to 768px
        const mobileScale = Math.min(0.52, Math.max(0.42, width / 780));
        dumbbellGroup.scale.set(mobileScale, mobileScale, mobileScale);
        camera.position.set(0, 0.55, 9.8);
      } else {
        dumbbellGroup.scale.set(1, 1, 1);
        camera.position.set(0, 1.35, 9.2);
      }
    }

    // Call immediately to scale correctly on mount
    updateResponsiveDimensions();

    // Mouse coordinates for dynamic studio reflection lights
    const mouse = new THREE.Vector2(0, 0);
    let hueTick = 0;
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── Mobile Touch Support: Smooth Vertical Scroll + Horizontal Rotate ──
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalSwipe = false;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isHorizontalSwipe = false;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;

        // If swipe has moved more horizontally than vertically, rotate dumbbell!
        if (!isHorizontalSwipe && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
          isHorizontalSwipe = true;
        }

        if (isHorizontalSwipe) {
          dumbbellGroup.rotation.y += dx * 0.008;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
        // If swiping vertically, do nothing: native browser scroll continues 100% unobstructed!
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── Main Animation Loop ──────────────────────────────────────────────
    const startTime = performance.now();
    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) * 0.001;

      // Gentle floating and subtle idle rotation
      dumbbellGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;
      dumbbellGroup.rotation.y += 0.002;

      // Dynamic studio lighting tracking cursor
      hueTick = (hueTick + 0.006) % 1;
      cursorLight1.color.setHSL(hueTick, 0.95, 0.55);
      cursorLight2.color.setHSL((hueTick + 0.35) % 1, 0.95, 0.55);
      cursorLight1.position.set(mouse.x * 5, mouse.y * 3 + 1, 3.5);
      cursorLight2.position.set(-mouse.x * 5, -mouse.y * 3 - 1, 3.5);

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", updateResponsiveDimensions);

    // ── Teardown on unmount ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateResponsiveDimensions);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      controls.dispose();
      renderer.dispose();
      pmremGenerator.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="anatomy-3d-section">
      <div className="bg-grid" />

      {/* Clean Magazine Editorial Header */}
      <header className="anatomy-header">
        <span className="label-bold">01.5 — The Discipline</span>
        <h2 className="editorial-title">
          THE <span className="outline">ANATOMY</span> OF DISCIPLINE
        </h2>
      </header>

      {/* 3D Three.js Viewport */}
      <div id="webgl-container" ref={webglRef} />

      <style>{`
        #anatomy-3d-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #ffffff;
        }

        @media (max-width: 768px) {
          #anatomy-3d-section {
            height: 80vh;
            min-height: 500px;
            max-height: 680px;
          }
        }

        #anatomy-3d-section .bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          z-index: 1;
        }

        #anatomy-3d-section .anatomy-header {
          position: absolute;
          top: 48px;
          left: 48px;
          right: 48px;
          z-index: 10;
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          #anatomy-3d-section .anatomy-header {
            left: 64px;
            right: 64px;
            top: 56px;
          }
        }

        #anatomy-3d-section .editorial-title {
          font-family: var(--font-heading), "Montserrat", sans-serif;
          font-weight: 900;
          font-size: clamp(1.85rem, 4.5vw, 4.25rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin-top: 0.75rem;
        }

        #anatomy-3d-section .editorial-title .outline {
          color: #ffffff;
          -webkit-text-stroke: 2px #0a0a0a;
          paint-order: stroke fill;
        }

        @media (min-width: 1024px) {
          #anatomy-3d-section .editorial-title .outline {
            -webkit-text-stroke: 2.5px #0a0a0a;
          }
        }

        #anatomy-3d-section #webgl-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          cursor: grab;
          touch-action: pan-y;
        }

        #anatomy-3d-section #webgl-container:active {
          cursor: grabbing;
        }

        @media (max-width: 768px) {
          #anatomy-3d-section .anatomy-header {
            left: 20px;
            right: 20px;
            top: 28px;
          }
          #anatomy-3d-section .editorial-title {
            font-size: clamp(1.6rem, 5.5vw, 2.4rem);
          }
        }
      `}</style>
    </section>
  );
}
