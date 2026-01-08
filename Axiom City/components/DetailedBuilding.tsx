import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BuildingType, WeatherType } from '../types';
import { Float } from '@react-three/drei';

// Reusable Geometries
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 8);
const sphereGeo = new THREE.SphereGeometry(1, 8, 8);



interface DetailedBuildingProps {
    type: BuildingType;
    baseColor: string;
    heightVar: number;
    rotation: number;
    hasRoadAccess?: boolean;
    isHovered?: boolean;
    position: [number, number, number];
    onClick?: () => void;
    weather?: WeatherType;
}

export const DetailedBuilding = React.memo(({ type, baseColor, heightVar, rotation, hasRoadAccess, isHovered, position, onClick, weather }: DetailedBuildingProps) => {

    const seed = useMemo(() => Math.random(), []); // Random seed for variation
    const buildingHeight = useMemo(() => Math.max(0.6, heightVar), [heightVar]);

    const content = useMemo(() => {
        const common = { castShadow: true, receiveShadow: true };
        const isSnowing = weather === WeatherType.Snow;
        const isRaining = weather === WeatherType.Rain;
        const isAcidRain = weather === WeatherType.AcidRain;

        // Reactive Materials
        const concreteMat = new THREE.MeshStandardMaterial({
            color: isSnowing ? '#cbd5e1' : (isAcidRain ? '#4d7c0f' : '#8899a6'),
            roughness: isRaining ? 0.2 : 0.8,
            metalness: isRaining ? 0.6 : 0
        });

        const metalMat = new THREE.MeshStandardMaterial({
            color: isSnowing ? '#e2e8f0' : (isAcidRain ? '#365314' : '#475569'),
            roughness: isRaining ? 0.1 : 0.3,
            metalness: isRaining ? 0.9 : 0.8
        });

        const mat = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: isRaining ? 0.2 : 0.7,
            metalness: isRaining ? 0.6 : 0.1,
            emissive: isAcidRain ? '#4d7c0f' : '#000000',
            emissiveIntensity: isAcidRain ? 0.3 : 0
        });

        const roofMat = new THREE.MeshStandardMaterial({
            color: isSnowing ? '#ffffff' : (isAcidRain ? '#1a2e05' : '#374151'),
            roughness: isSnowing ? 0.9 : 0.5
        });

        const matDark = new THREE.MeshStandardMaterial({
            color: isSnowing ? '#94a3b8' : '#111827',
            roughness: isRaining ? 0.1 : 0.8
        });

        const glassMat = new THREE.MeshStandardMaterial({
            color: isAcidRain ? '#4d7c0f' : '#60a5fa',
            roughness: isRaining ? 0.05 : 0.1,
            metalness: isRaining ? 1.0 : 0.9,
            opacity: 0.8,
            transparent: true
        });

        const emissiveCyan = new THREE.MeshStandardMaterial({
            color: isAcidRain ? '#84cc16' : '#22d3ee',
            emissive: isAcidRain ? '#84cc16' : '#22d3ee',
            emissiveIntensity: isAcidRain ? 0.5 : 2
        });

        const emissivePink = new THREE.MeshStandardMaterial({
            color: isAcidRain ? '#a855f7' : '#e879f9',
            emissive: isAcidRain ? '#a855f7' : '#e879f9',
            emissiveIntensity: isAcidRain ? 0.5 : 2
        });

        switch (type) {
            case BuildingType.Residential:
                // Sci-Fi Condo: Stacked offset boxes
                return (
                    <group>
                        {/* Base */}
                        <mesh {...common} geometry={boxGeo} material={concreteMat} position={[0, 0.3, 0]} scale={[0.8, 0.6, 0.8]} />
                        {/* Living Unit 1 */}
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0.1, 0.7, 0.1]} scale={[0.6, 0.5, 0.6]} />
                        {/* Living Unit 2 (Rotated/Offset) */}
                        <mesh {...common} geometry={boxGeo} material={metalMat} position={[-0.1, 1.1, -0.1]} scale={[0.5, 0.5, 0.5]} />
                        {/* Window/Glow */}
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0.1, 0.7, 0.41]} scale={[0.2, 0.2, 0.05]} />
                    </group>
                );
            case BuildingType.Apartment:
                // High-rise Capsule Tower
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={metalMat} position={[0, buildingHeight * 0.8, 0]} scale={[0.6, buildingHeight * 1.6, 0.6]} />
                        {/* Capsules sticking out */}
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0.2, buildingHeight * 0.5, 0]} scale={[0.5, 0.3, 0.7]} />
                        <mesh {...common} geometry={boxGeo} material={mat} position={[-0.2, buildingHeight * 1.0, 0]} scale={[0.5, 0.3, 0.7]} />
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, buildingHeight * 1.4, 0.2]} scale={[0.7, 0.3, 0.4]} />
                        {/* Roof Element */}
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0, buildingHeight * 1.6 + 0.1, 0]} scale={[0.1, 0.4, 0.1]} />
                    </group>
                );
            case BuildingType.Commercial:
                // Cyberpunk Shop: Glass front + Neon
                return (
                    <group>
                        {/* Main Structure */}
                        <mesh {...common} geometry={boxGeo} material={metalMat} position={[0, 0.5 * buildingHeight, 0]} scale={[0.9, buildingHeight, 0.9]} />
                        {/* Glass Front */}
                        <mesh geometry={boxGeo} material={glassMat} position={[0, 0.5 * buildingHeight, 0.46]} scale={[0.85, buildingHeight * 0.9, 0.1]} />
                        {/* Neon Sign Header */}
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, buildingHeight, 0.5]} scale={[0.9, 0.2, 0.1]} />
                        {/* Side Vents */}
                        <mesh geometry={boxGeo} material={concreteMat} position={[0.5, 0.2, 0]} scale={[0.1, 0.8, 0.8]} />
                    </group>
                );
            case BuildingType.Industrial:
                // Factory: Pipes and Tanks
                return (
                    <group>
                        {/* Main Hall */}
                        <mesh {...common} geometry={boxGeo} material={metalMat} position={[0, 0.4, 0]} scale={[0.95, 0.8, 0.95]} />
                        {/* Smokestacks */}
                        <mesh {...common} geometry={cylinderGeo} material={matDark} position={[0.25, 0.9, 0.25]} scale={[0.15, 0.6, 0.15]} />
                        <mesh {...common} geometry={cylinderGeo} material={matDark} position={[-0.25, 0.8, -0.25]} scale={[0.12, 0.8, 0.12]} />
                        {/* Glowing Core */}
                        <mesh geometry={sphereGeo} material={emissiveCyan} position={[0, 0.4, 0]} scale={[0.3, 0.3, 0.3]} />
                    </group>
                );
            case BuildingType.Park:
                return (
                    <group>
                        {/* Grass Base */}
                        <mesh {...common} geometry={boxGeo} material={new THREE.MeshStandardMaterial({ color: isSnowing ? '#f1f5f9' : (isAcidRain ? '#3f6212' : '#4ade80'), roughness: isRaining ? 0.3 : 0.8 })} position={[0, 0.05, 0]} scale={[0.95, 0.1, 0.95]} />
                        {/* Trees */}
                        <group position={[0.2, 0.2, 0.2]}>
                            <mesh {...common} geometry={cylinderGeo} material={new THREE.MeshStandardMaterial({ color: '#422006' })} scale={[0.05, 0.3, 0.05]} />
                            <mesh {...common} geometry={sphereGeo} material={new THREE.MeshStandardMaterial({ color: isSnowing ? '#ffffff' : '#166534' })} position={[0, 0.2, 0]} scale={[0.2, 0.2, 0.2]} />
                        </group>
                        <group position={[-0.3, 0.2, -0.1]}>
                            <mesh {...common} geometry={cylinderGeo} material={new THREE.MeshStandardMaterial({ color: '#422006' })} scale={[0.05, 0.25, 0.05]} />
                            <mesh {...common} geometry={sphereGeo} material={new THREE.MeshStandardMaterial({ color: isSnowing ? '#f8fafc' : '#15803d' })} position={[0, 0.15, 0]} scale={[0.15, 0.15, 0.15]} />
                        </group>
                        {/* Fountain/Art */}
                        <mesh geometry={cylinderGeo} material={glassMat} position={[-0.1, 0.15, 0.3]} scale={[0.2, 0.1, 0.2]} />
                    </group>
                );
            case BuildingType.MegaMall:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.6, 0]} scale={[1, 1.2, 1]} />
                        <mesh geometry={boxGeo} material={glassMat} position={[0, 0.6, 0.51]} scale={[0.9, 1, 0.05]} />
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, 1.3, 0]} scale={[1.1, 0.1, 1.1]} />
                    </group>
                )
            case BuildingType.Police:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.4, 0]} scale={[0.9, 0.8, 0.9]} />
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0, 0.85, 0]} scale={[0.8, 0.1, 0.8]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0.2, 0.9, 0.2]} scale={[0.05, 0.4, 0.05]} />
                    </group>
                );
            case BuildingType.FireStation:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.4, 0]} scale={[0.9, 0.8, 0.9]} />
                        <mesh geometry={boxGeo} material={matDark} position={[0, 0.3, 0.41]} scale={[0.7, 0.4, 0.1]} /> {/* Garage door */}
                        <mesh geometry={sphereGeo} material={new THREE.MeshStandardMaterial({ color: 'red', emissive: 'red' })} position={[0, 0.85, 0]} scale={[0.1, 0.1, 0.1]} />
                        {isSnowing && (
                            <mesh geometry={boxGeo} material={roofMat} position={[0, 0.81, 0]} scale={[0.95, 0.05, 0.95]} />
                        )}
                    </group>
                );
            case BuildingType.School:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={concreteMat} position={[0, 0.3, 0]} scale={[0.9, 0.6, 0.9]} />
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.7, 0]} scale={[0.7, 0.4, 0.7]} />
                        <mesh geometry={cylinderGeo} material={matDark} position={[0, 1.0, 0]} scale={[0.05, 0.3, 0.05]} /> {/* Flagpole */}
                        {isSnowing && <mesh geometry={boxGeo} material={roofMat} position={[0, 0.9, 0]} scale={[0.75, 0.05, 0.75]} />}
                    </group>
                );
            case BuildingType.GoldMine:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={new THREE.MeshStandardMaterial({ color: isAcidRain ? '#365314' : '#451a03' })} position={[0, 0.4, 0]} scale={[1, 0.8, 1]} />
                        <mesh {...common} geometry={boxGeo} material={matDark} position={[0, 0.3, 0.45]} scale={[0.4, 0.6, 0.1]} /> {/* Mine entrance */}
                        <mesh geometry={boxGeo} material={new THREE.MeshStandardMaterial({ color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.5 })} position={[0, 0.85, 0]} scale={[0.2, 0.1, 0.2]} />
                        {isSnowing && <mesh geometry={boxGeo} material={roofMat} position={[0, 0.81, 0]} scale={[1.05, 0.05, 1.05]} />}
                    </group>
                );
            case BuildingType.Mansion:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.3, 0]} scale={[1, 0.6, 1]} />
                        <mesh {...common} geometry={cylinderGeo} material={mat} position={[0.3, 0.8, 0.3]} scale={[0.2, 1, 0.2]} />
                        <mesh {...common} geometry={cylinderGeo} material={mat} position={[-0.3, 0.8, -0.3]} scale={[0.2, 1, 0.2]} />
                        <mesh geometry={sphereGeo} material={glassMat} position={[0, 0.7, 0]} scale={[0.3, 0.3, 0.3]} />
                    </group>
                );
            case BuildingType.SpacePort:
                return (
                    <group>
                        <mesh {...common} geometry={cylinderGeo} material={metalMat} position={[0, 0.1, 0]} scale={[1, 0.2, 1]} />
                        <mesh {...common} geometry={cylinderGeo} material={concreteMat} position={[0, 1.0, 0]} scale={[0.3, 1.8, 0.3]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0, 1.9, 0]} scale={[0.32, 0.1, 0.32]} />
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0, 0.1, 0]} scale={[0.8, 0.05, 0.8]} />
                    </group>
                );
            case BuildingType.ResearchCentre:
                return (
                    <group>
                        <mesh {...common} geometry={sphereGeo} material={glassMat} position={[0, 0.8, 0]} scale={[0.8, 0.8, 0.8]} />
                        <mesh {...common} geometry={boxGeo} material={metalMat} position={[0, 0.2, 0]} scale={[1, 0.4, 1]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0, 0.8, 0]} scale={[0.1, 1.2, 0.1]} />
                    </group>
                );
            case BuildingType.Stadium:
                return (
                    <group>
                        <mesh {...common} geometry={cylinderGeo} material={concreteMat} position={[0, 0.3, 0]} scale={[1, 0.6, 1]} />
                        <mesh geometry={cylinderGeo} material={new THREE.MeshStandardMaterial({ color: isSnowing ? '#ffffff' : (isAcidRain ? '#4d7c0f' : '#166534') })} position={[0, 0.61, 0]} scale={[0.8, 0.01, 0.8]} /> {/* Field */}
                        <mesh {...common} geometry={cylinderGeo} material={mat} position={[0, 0.5, 0]} scale={[1.1, 0.2, 1.1]} /> {/* Seating */}
                    </group>
                );
            case BuildingType.Casino:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.5, 0]} scale={[1, 1, 1]} />
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, 0.5, 0.51]} scale={[0.8, 0.8, 0.05]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0.4, 1.1, 0.4]} scale={[0.1, 0.4, 0.1]} />
                    </group>
                );
            case BuildingType.Hospital:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.6, 0]} scale={[0.9, 1.2, 0.9]} />
                        {/* Cross Sign */}
                        <group position={[0, 1.0, 0.46]} scale={[0.4, 0.4, 0.1]}>
                            <mesh geometry={boxGeo} material={new THREE.MeshBasicMaterial({ color: 'red' })} scale={[0.3, 1, 1]} />
                            <mesh geometry={boxGeo} material={new THREE.MeshBasicMaterial({ color: 'red' })} scale={[1, 0.3, 1]} />
                        </group>
                        <mesh geometry={cylinderGeo} material={glassMat} position={[0, 1.25, 0]} scale={[0.6, 0.1, 0.6]} />
                    </group>
                );
            case BuildingType.Bridge:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={concreteMat} position={[0, 0.45, 0]} scale={[1, 0.1, 1]} />
                        <mesh {...common} geometry={boxGeo} material={concreteMat} position={[0, 0.25, 0.4]} scale={[1, 0.5, 0.1]} />
                        <mesh {...common} geometry={boxGeo} material={concreteMat} position={[0, 0.25, -0.4]} scale={[1, 0.5, 0.1]} />
                    </group>
                );
            case BuildingType.University:
                return (
                    <group>
                        {/* Classical Quad Style */}
                        <mesh {...common} geometry={boxGeo} material={concreteMat} position={[0, 0.4, 0]} scale={[1, 0.8, 1]} />
                        <mesh {...common} geometry={boxGeo} material={mat} position={[0, 0.9, 0]} scale={[0.6, 0.4, 0.6]} /> {/* Dome/Top */}
                        <mesh geometry={cylinderGeo} material={concreteMat} position={[0.4, 0.6, 0.4]} scale={[0.1, 1.2, 0.1]} /> {/* Pillars */}
                        <mesh geometry={cylinderGeo} material={concreteMat} position={[-0.4, 0.6, 0.4]} scale={[0.1, 1.2, 0.1]} />
                    </group>
                );
            case BuildingType.Road:
                return (
                    <group>
                        {/* 3D Road Surface slightly elevated */}
                        <mesh {...common} geometry={boxGeo} material={new THREE.MeshStandardMaterial({ color: '#1f2937' })} position={[0, 0.01, 0]} scale={[1, 0.02, 1]} />
                        {/* Yellow line */}
                        <mesh geometry={boxGeo} material={new THREE.MeshStandardMaterial({ color: '#facc15' })} position={[0, 0.021, 0]} scale={[0.1, 0.01, 0.6]} />
                    </group>
                );
            default:
                // Default Tech Box
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={metalMat} position={[0, 0.4 * buildingHeight, 0]} scale={[0.7, 0.8 * buildingHeight, 0.7]} />
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0, 0.7 * buildingHeight, 0]} scale={[0.75, 0.05, 0.75]} />
                    </group>
                );
        }
    }, [type, baseColor, buildingHeight, seed]);

    // Warning Indicator Component
    const WarningIndicator = () => (
        <group position={[0, 1.8, 0]}>
            {/* Floating holographic look */}
            <Float speed={5} rotationIntensity={0} floatIntensity={0.5}>
                <mesh>
                    <sphereGeometry args={[0.15]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <ringGeometry args={[0.2, 0.25, 32]} />
                    <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} transparent opacity={0.5} />
                </mesh>
            </Float>
            {/* Line to ground */}
            <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.4} />
            </mesh>
        </group>
    );

    return (
        <group
            position={position}
            rotation={[0, rotation, 0]}
            scale={isHovered ? 1.05 : 1}
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        >
            {content}
            {hasRoadAccess === false && <WarningIndicator />}
        </group>
    );
});
