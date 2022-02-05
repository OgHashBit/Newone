import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from 'react-three-fiber'
import { Physics, usePlane, useConvexPolyhedron } from 'use-cannon'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './styles.css'

function Diamond(props) {
  const { nodes } = useLoader(GLTFLoader, '/diamond.glb')
  const geo = useMemo(() => new THREE.Geometry().fromBufferGeometry(nodes.Cylinder.geometry), [nodes])
  const [ref, api] = useConvexPolyhedron(() => ({ mass: 10, ...props, args: geo }))
  return (
    <mesh
      castShadow
      ref={ref}
      geometry={nodes.Cylinder.geometry}
      dispose={null}
      onClick={e => {
        console.log('forceful!')
        api.applyImpulse([10, 30, 0], [0, 0, 0])
      }}>
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}

function Plane(props) {
  const [ref] = usePlane(() => ({ mass: 0, ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[50, 50]} />
      <shadowMaterial attach="material" color="#171717" />
    </mesh>
  )
}

ReactDOM.render(
  <Canvas shadowMap sRGB gl={{ alpha: false }} camera={{ position: [-1, 1, 5], fov: 50 }}>
    <color attach="background" args={['lightgreen']} />
    <hemisphereLight intensity={0.35} />
    <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
    <Physics>
      <Plane rotation={[-Math.PI / 2, 0, 0]} />
      <Suspense fallback={null}>
        <Diamond position={[0, 5, 0]} rotation={[0.1, 0.1, 0.1]} />
      </Suspense>
    </Physics>
  </Canvas>,
  document.getElementById('root')
)
