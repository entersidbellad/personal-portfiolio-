import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Generate a 3D grid of points in a cube formation
function generateCubeGrid(gridSize, spacing) {
    const points = [];
    const offset = ((gridSize - 1) * spacing) / 2;

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                points.push(new THREE.Vector3(
                    x * spacing - offset,
                    y * spacing - offset,
                    z * spacing - offset
                ));
            }
        }
    }
    return points;
}

export default function IsometricGridCube({ gridSize = 14, spacing = 0.18 }) {
    const groupRef = useRef();
    const pointsRef = useRef();
    const mouseRef = useRef(new THREE.Vector2());
    const raycaster = useRef(new THREE.Raycaster());
    const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
    const { size, camera } = useThree();
    const { isDark } = useTheme();

    // Store particle velocities for spring physics
    const velocitiesRef = useRef(null);
    const displacementsRef = useRef(null);

    // Generate cube points
    const basePoints = useMemo(() => {
        return generateCubeGrid(gridSize, spacing);
    }, [gridSize, spacing]);

    // Initialize velocities and displacements
    useMemo(() => {
        velocitiesRef.current = new Float32Array(basePoints.length * 3);
        displacementsRef.current = new Float32Array(basePoints.length * 3);
    }, [basePoints]);

    // Create point geometry with sizes
    const { geometry } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(basePoints.length * 3);
        const sizes = new Float32Array(basePoints.length);

        basePoints.forEach((p, i) => {
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;

            // Calculate distance from center for point size variation
            const dist = p.length();
            const maxDist = Math.sqrt(3) * ((gridSize - 1) * spacing) / 2;
            // Smaller, denser particles with slight size variation
            sizes[i] = 0.06 + (1 - dist / maxDist) * 0.03;
        });

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        return { geometry: geo };
    }, [basePoints, gridSize, spacing]);

    // Mouse move handler
    useEffect(() => {
        const handleMouseMove = (event) => {
            mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
            mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [size]);

    // Shader material for variable-size points
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                pointColor: { value: new THREE.Color(isDark ? '#f5f5f5' : '#000000') },
                opacity: { value: 1.0 }
            },
            vertexShader: `
                attribute float size;
                varying float vOpacity;

                void main() {
                    vOpacity = 1.0;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (400.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 pointColor;
                uniform float opacity;
                varying float vOpacity;

                void main() {
                    // Create circular points
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Very sharp edges for maximum opacity
                    float alpha = 1.0 - smoothstep(0.2, 0.4, dist);
                    gl_FragColor = vec4(pointColor, opacity * alpha * vOpacity * 1.0);
                }
            `,
            transparent: true,
            depthWrite: false
        });
    }, [isDark]);

    // Update particle color when theme changes
    useEffect(() => {
        if (shaderMaterial) {
            shaderMaterial.uniforms.pointColor.value.set(isDark ? '#f5f5f5' : '#000000');
        }
    }, [isDark, shaderMaterial]);

    // Animation loop with ripple physics
    useFrame((state, delta) => {
        if (!groupRef.current || !pointsRef.current) return;

        const time = state.clock.elapsedTime;
        const positions = geometry.attributes.position.array;
        const velocities = velocitiesRef.current;
        const displacements = displacementsRef.current;

        // Get mouse position in 3D space
        raycaster.current.setFromCamera(mouseRef.current, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.current.ray.intersectPlane(planeRef.current, intersectPoint);

        // Transform mouse position to local space of the group
        if (groupRef.current) {
            const inverseMatrix = new THREE.Matrix4().copy(groupRef.current.matrixWorld).invert();
            intersectPoint.applyMatrix4(inverseMatrix);
        }

        // Physics constants
        const rippleRadius = 1.2;      // How far the ripple effect reaches
        const rippleStrength = 0.4;    // How strongly particles are pushed
        const springStiffness = 8.0;   // How quickly particles return
        const damping = 0.85;          // Velocity damping (0-1)

        // Update each particle
        for (let i = 0; i < basePoints.length; i++) {
            const baseX = basePoints[i].x;
            const baseY = basePoints[i].y;
            const baseZ = basePoints[i].z;

            // Current displacement
            const dx = displacements[i * 3];
            const dy = displacements[i * 3 + 1];
            const dz = displacements[i * 3 + 2];

            // Distance from mouse in local space
            const toMouseX = baseX - intersectPoint.x;
            const toMouseY = baseY - intersectPoint.y;
            const toMouseZ = baseZ - intersectPoint.z;
            const distToMouse = Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY + toMouseZ * toMouseZ);

            // Calculate ripple force (wave-like falloff)
            let forceX = 0, forceY = 0, forceZ = 0;

            if (distToMouse < rippleRadius && distToMouse > 0.01) {
                // Sine wave creates the ripple effect
                const wavePhase = (distToMouse / rippleRadius) * Math.PI;
                const waveFactor = Math.sin(wavePhase) * (1 - distToMouse / rippleRadius);

                // Push outward from mouse
                const normalizedX = toMouseX / distToMouse;
                const normalizedY = toMouseY / distToMouse;
                const normalizedZ = toMouseZ / distToMouse;

                forceX = normalizedX * waveFactor * rippleStrength;
                forceY = normalizedY * waveFactor * rippleStrength;
                forceZ = normalizedZ * waveFactor * rippleStrength;
            }

            // Spring force to return to base position
            const springForceX = -dx * springStiffness * delta;
            const springForceY = -dy * springStiffness * delta;
            const springForceZ = -dz * springStiffness * delta;

            // Update velocities
            velocities[i * 3] = (velocities[i * 3] + forceX + springForceX) * damping;
            velocities[i * 3 + 1] = (velocities[i * 3 + 1] + forceY + springForceY) * damping;
            velocities[i * 3 + 2] = (velocities[i * 3 + 2] + forceZ + springForceZ) * damping;

            // Update displacements
            displacements[i * 3] += velocities[i * 3];
            displacements[i * 3 + 1] += velocities[i * 3 + 1];
            displacements[i * 3 + 2] += velocities[i * 3 + 2];

            // Apply to positions
            positions[i * 3] = baseX + displacements[i * 3];
            positions[i * 3 + 1] = baseY + displacements[i * 3 + 1];
            positions[i * 3 + 2] = baseZ + displacements[i * 3 + 2];
        }

        geometry.attributes.position.needsUpdate = true;

        // Slow, elegant rotation (isometric-ish angle)
        groupRef.current.rotation.y += delta * 0.15;
        groupRef.current.rotation.x = Math.PI * 0.15 + Math.sin(time * 0.3) * 0.05;

        // Subtle floating motion
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    });

    return (
        <group ref={groupRef} rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
            <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />
        </group>
    );
}
