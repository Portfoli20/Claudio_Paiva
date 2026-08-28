/* A real-time WebGL scene: deliberately procedural, so there is no heavy 3D file to download. */
(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Native WebGL fallback keeps the 3D tunnel functional even when a CDN is unavailable.
    const createNativeWebglScene = () => {
        const canvas = document.createElement('canvas');
        canvas.className = 'webgl-scene';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(canvas);
        const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
        if (!gl) { canvas.remove(); return; }

        const compile = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };
        const program = gl.createProgram();
        gl.attachShader(program, compile(gl.VERTEX_SHADER, `
            attribute vec3 aPosition;
            uniform float uTime; uniform float uScroll; uniform vec2 uPointer;
            varying float vDepth; varying float vTint;
            void main() {
                float depth = fract(aPosition.z + uTime * .045 + uScroll * 2.8);
                float perspective = mix(.18, 1.45, depth);
                vec2 point = aPosition.xy / perspective;
                point += uPointer * .055 * (1.0 - depth);
                gl_Position = vec4(point, 0.0, 1.0);
                gl_PointSize = mix(4.4, .65, depth) * (1.0 + sin(aPosition.z * 80.0 + uTime) * .16);
                vDepth = depth; vTint = aPosition.z;
            }`));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, `
            precision mediump float;
            varying float vDepth; varying float vTint;
            void main() {
                vec2 center = gl_PointCoord - .5;
                float glow = smoothstep(.5, .06, length(center));
                vec3 cyan = vec3(.46, .96, 1.0); vec3 violet = vec3(.62, .48, 1.0);
                vec3 color = mix(cyan, violet, .5 + .5 * sin(vTint * 43.0));
                gl_FragColor = vec4(color, glow * mix(.06, .8, 1.0 - vDepth));
            }`));
        gl.linkProgram(program);
        gl.useProgram(program);

        const count = 1500;
        const data = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = i * 2.39996;
            const radius = .4 + ((i * 31) % 100) / 44;
            data[i * 3] = Math.cos(angle) * radius;
            data[i * 3 + 1] = Math.sin(angle) * radius * .62;
            data[i * 3 + 2] = i / count;
        }
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        const time = gl.getUniformLocation(program, 'uTime');
        const scroll = gl.getUniformLocation(program, 'uScroll');
        const pointer = gl.getUniformLocation(program, 'uPointer');
        const state = { x: 0, y: 0, scroll: 0 };
        const resize = () => {
            const ratio = Math.min(window.devicePixelRatio, 1.75);
            canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('pointermove', event => { state.x = event.clientX / innerWidth - .5; state.y = .5 - event.clientY / innerHeight; }, { passive: true });
        window.addEventListener('scroll', () => { state.scroll = scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1); }, { passive: true });
        resize();
        const startedAt = performance.now();
        const render = now => {
            gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(time, (now - startedAt) / 1000);
            gl.uniform1f(scroll, state.scroll);
            gl.uniform2f(pointer, state.x, state.y);
            gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.drawArrays(gl.POINTS, 0, count);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    };

    if (!window.THREE) { createNativeWebglScene(); return; }

    const canvas = document.createElement('canvas');
    canvas.className = 'webgl-scene';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.set(0, 0, 15);

    const universe = new THREE.Group();
    scene.add(universe);
    const cyan = new THREE.Color('#75f4ff');
    const violet = new THREE.Color('#9d7bff');

    // Deterministic star tunnel: visual richness without a network-loaded model.
    const starCount = 1050;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        const angle = i * 2.39996;
        const radius = 2.5 + ((i * 37) % 100) / 18;
        const depth = -26 + ((i * 53) % 1000) / 38;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius * .62;
        positions[i * 3 + 2] = depth;
        const color = i % 3 ? cyan : violet;
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ size: .035, vertexColors: true, transparent: true, opacity: .72, blending: THREE.AdditiveBlending, depthWrite: false }));
    universe.add(stars);

    const core = new THREE.Group();
    const wireMaterial = new THREE.MeshBasicMaterial({ color: cyan, wireframe: true, transparent: true, opacity: .3 });
    const coreShape = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 2), wireMaterial);
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.25, .018, 8, 120), new THREE.MeshBasicMaterial({ color: violet, transparent: true, opacity: .42 }));
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(3.05, .012, 8, 120), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: .32 }));
    ringA.rotation.x = .95; ringB.rotation.set(-.7, .35, .2);
    core.add(coreShape, ringA, ringB);
    core.position.set(3.9, .2, -5);
    universe.add(core);

    const pointer = { x: 0, y: 0, scroll: 0 };
    const resize = () => {
        const { innerWidth: width, innerHeight: height } = window;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', event => {
        pointer.x = (event.clientX / window.innerWidth - .5) * 2;
        pointer.y = (event.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });
    window.addEventListener('scroll', () => {
        const distance = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        pointer.scroll = window.scrollY / distance;
    }, { passive: true });
    resize();

    const clock = new THREE.Clock();
    const render = () => {
        const elapsed = clock.getElapsedTime();
        const journey = pointer.scroll;
        universe.rotation.z += (pointer.x * .08 - universe.rotation.z) * .025;
        universe.rotation.x += (-pointer.y * .06 - universe.rotation.x) * .02;
        stars.rotation.z = elapsed * .012 + journey * 1.8;
        stars.position.z = journey * 18;
        core.rotation.x = elapsed * .22 + journey * Math.PI * 4;
        core.rotation.y = elapsed * .17 + journey * Math.PI * 3;
        core.position.y = .2 - journey * 4.5;
        core.position.x = 3.9 - journey * 7.3;
        core.scale.setScalar(1 + journey * .85);
        camera.position.z = 15 - journey * 3;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
})();
