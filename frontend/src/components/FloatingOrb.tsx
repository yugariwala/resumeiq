import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Orb() {
    const meshRef = useRef<THREE.Mesh>(null!)
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        meshRef.current.rotation.x = t * 0.003 * 60
        meshRef.current.rotation.y = t * 0.002 * 60
        meshRef.current.position.y = Math.sin(t * 0.8) * 0.3
    })
    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2, 1]} />
            <meshStandardMaterial
                color="#3B82F6"
                wireframe
                transparent
                opacity={0.6}
            />
        </mesh>
    )
}

export default function FloatingOrb() {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#3B82F6" />
                <pointLight position={[-5, -5, 5]} intensity={0.5} color="#10B981" />
                <Orb />
            </Canvas>
        </div>
    )
}
