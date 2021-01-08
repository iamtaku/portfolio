(function () {
  const container = document.getElementById("globe");
  const canvas = container.querySelector("canvas");

  function init(points) {
    const { width, height } = container.getBoundingClientRect();

    // 1. Setup scene
    const scene = new THREE.Scene();
    // 2. Setup camera
    const camera = new THREE.PerspectiveCamera(45, width / height);
    // 3. Setup renderer
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(width, height);
    const mergedGeometry = new THREE.Geometry();
    // Material that the points will be made of.
    const pointGeometry = new THREE.SphereGeometry(0.5, 1, 1);
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: "#000",
    });

    const globeRadius = 100;
    const globeWidth = 4098 / 2;
    const globeHeight = 1968 / 2;

    function convertFlatCoordsToSphereCoords(x, y) {
      let latitude = ((x - globeWidth) / globeWidth) * -180;
      let longitude = ((y - globeHeight) / globeHeight) * -90;
      latitude = (latitude * Math.PI) / 180;
      longitude = (longitude * Math.PI) / 180;
      const radius = Math.cos(longitude) * globeRadius;

      return {
        x: Math.cos(latitude) * radius,
        y: Math.sin(longitude) * globeRadius,
        z: Math.sin(latitude) * radius,
      };
    }
    // const pointMaterial = new THREE.MeshBasicMaterial({
    //   color: "#000"
    // });

    for (let point of points) {
      const { x, y, z } = convertFlatCoordsToSphereCoords(
        point.x,
        point.y,
        width,
        height
      );

      pointGeometry.translate(x, y, z);
      mergedGeometry.merge(pointGeometry);
      pointGeometry.translate(-x, -y, -z);
    }
    const globeShape = new THREE.Mesh(mergedGeometry, pointMaterial);
    scene.add(globeShape);

    camera.orbitControls = new THREE.OrbitControls(camera, canvas);
    camera.orbitControls.enablePan = true;
    camera.orbitControls.enableRotate = true;
    camera.orbitControls.autoRotate = true;
    // Tweak this value based on how far/away you'd like the camera
    // to be from the globe.
    camera.position.z = -265;

    // 4. Use requestAnimationFrame to recursively draw the scene in the DOM.
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      camera.orbitControls.update();
    }
    animate();
  }

  function hasWebGL() {
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      return true;
    } else {
      return false;
    }
  }

  if (hasWebGL()) {
    window
      .fetch("../points.json")
      .then((response) => response.json())
      .then((data) => {
        init(data.points);
      });
  }
})();
