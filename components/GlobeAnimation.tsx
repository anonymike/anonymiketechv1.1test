"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Points } from "@react-three/drei"
import * as THREE from "three"

function Globe() {
  const globeRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0002
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z += 0.0001
    }
  })

  useEffect(() => {
    // Create particle geometry for glowing effect
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 800
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  }, [])

  return (
    <group ref={globeRef}>
      {/* Wireframe globe */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color="#00d4ff"
          wireframe={true}
          emissive="#0080aa"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Solid globe with texture */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={null}
          color="#001a33"
          emissive="#003d66"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Glowing particles */}
      <Points
        ref={particlesRef}
        positions={new Float32Array(Array.from({ length: 800 * 3 }, () => {
          const radius = 2.5
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          return radius * Math.sin(phi) * Math.cos(theta)
        }))}
      >
        <pointsMaterial size={0.02} color="#ff00ff" sizeAttenuation={true} />
      </Points>

      {/* Glow effect layers */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshPhongMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.15}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshPhongMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          transparent={true}
          opacity={0.08}
        />
      </mesh>

      {/* Orbital rings */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={64}
            array={new Float32Array(
              Array.from({ length: 64 }, (_, i) => {
                const angle = (i / 64) * Math.PI * 2
                return [Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5]
              }).flat()
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00d4ff" linewidth={1} transparent opacity={0.4} />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={64}
            array={new Float32Array(
              Array.from({ length: 64 }, (_, i) => {
                const angle = (i / 64) * Math.PI * 2
                return [Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0]
              }).flat()
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff00ff" linewidth={1} transparent opacity={0.3} />
      </line>
    </group>
  )
}

export default function GlobeAnimation() {
  return (
    <div className="w-full h-96 md:h-full">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        style={{
          background: "transparent",
        }}
      >
        <ambientLight intensity={0.6} color="#00d4ff" />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />

        <Globe />
      </Canvas>
    </div>
  )
}
