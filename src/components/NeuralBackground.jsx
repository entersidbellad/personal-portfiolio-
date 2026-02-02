import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import IsometricGridCube from './IsometricGridCube';

export default function NeuralBackground() {
    // Responsive camera - further back on mobile to show full cube
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth < 768
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cameraZ = isMobile ? 8 : 6;

    return (
        <div className="fixed inset-0 z-0 pointer-events-auto">
            <Canvas
                camera={{ position: [0, 0, cameraZ], fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <IsometricGridCube gridSize={isMobile ? 12 : 14} spacing={0.18} />
                </Suspense>
            </Canvas>
        </div>
    );
}
