import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BuildingType, WeatherType } from '../types';
import { Float } from '@react-three/drei';

// Reusable Geometries - Moved to module scope for stability
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 8);
const sphereGeo = new THREE.SphereGeometry(1, 8, 8);

// Material Cache to prevent leaks and improve performance
const materialCache: Record<string, THREE.MeshStandardMaterial> = {};

const getCachedMaterial = (key: string, props: any) => {
    if (!materialCache[key]) {
        materialCache[key] = new THREE.MeshStandardMaterial(props);
    } else {
        const mat = materialCache[key];
        if (props.color && mat.color) mat.color.set(props.color);
        if (props.emissive && mat.emissive) mat.emissive.set(props.emissive);
        if (props.roughness !== undefined) mat.roughness = props.roughness;
        if (props.metalness !== undefined) mat.metalness = props.metalness;
        if (props.opacity !== undefined) mat.opacity = props.opacity;
        if (props.transparent !== undefined) mat.transparent = props.transparent;
        if (props.emissiveIntensity !== undefined) mat.emissiveIntensity = props.emissiveIntensity;
    }
    return materialCache[key];
};

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

    const seed = useMemo(() => Math.random(), []);
    const buildingHeight = useMemo(() => Math.max(0.6, heightVar), [heightVar]);

    // Weather flags for material logic
    const isSnowing = weather === WeatherType.Snow;
    const isRaining = weather === WeatherType.Rain || weather === WeatherType.Thunderstorm;
    const isAcidRain = weather === WeatherType.AcidRain;
    const isSandstorm = weather === WeatherType.Sandstorm;
    const isHeatwave = weather === WeatherType.Heatwave;
    const isToxicSmog = weather === WeatherType.ToxicSmog;
    const isBloodMoon = weather === WeatherType.BloodMoon;
    const isAurora = weather === WeatherType.Aurora;
    const isStardust = weather === WeatherType.Stardust;

    const materials = useMemo(() => {
        const weatherSuffix = weather || 'CLEAR';

        const concrete = getCachedMaterial(`concrete-${weatherSuffix}`, {
            color: isSnowing ? '#cbd5e1' : isAcidRain ? '#4d7c0f' : isSandstorm ? '#92400e' : isToxicSmog ? '#111827' : isBloodMoon ? '#450a0a' : isHeatwave ? '#94a3b8' : '#8899a6',
            roughness: isRaining ? 0.2 : (isHeatwave ? 0.9 : 0.8),
            metalness: isRaining ? 0.6 : 0
        });

        const metal = getCachedMaterial(`metal-${weatherSuffix}`, {
            color: isSnowing ? '#e2e8f0' : isAcidRain ? '#365314' : isSandstorm ? '#78350f' : isToxicSmog ? '#020617' : isBloodMoon ? '#7f1d1d' : isHeatwave ? '#475569' : '#475569',
            roughness: isRaining ? 0.1 : 0.3,
            metalness: isRaining ? 0.9 : 0.8
        });

        const primary = getCachedMaterial(`primary-${baseColor}-${weatherSuffix}`, {
            color: isHeatwave ? '#ea580c' : (isBloodMoon ? '#991b1b' : baseColor),
            roughness: isRaining ? 0.2 : 0.7,
            metalness: isRaining ? 0.6 : 0.1,
            emissive: isAcidRain ? '#4d7c0f' : (isHeatwave ? '#7c2d12' : (isBloodMoon ? '#7f1d1d' : (isStardust ? '#cbd5e1' : '#000000'))),
            emissiveIntensity: isAcidRain ? 0.3 : (isHeatwave || isBloodMoon ? 0.4 : (isStardust ? 0.2 : 0))
        });

        const glass = getCachedMaterial(`glass-${weatherSuffix}`, {
            color: isAcidRain ? '#4d7c0f' : (isBloodMoon ? '#7f1d1d' : '#60a5fa'),
            roughness: isRaining ? 0.05 : 0.1,
            metalness: isRaining ? 1.0 : 0.9,
            opacity: 0.8,
            transparent: true
        });

        const emissiveCyan = getCachedMaterial(`e-cyan-${weatherSuffix}`, {
            color: isAcidRain ? '#84cc16' : (isAurora ? '#a5f3fc' : (isBloodMoon ? '#ef4444' : '#22d3ee')),
            emissive: isAcidRain ? '#84cc16' : (isAurora ? '#a5f3fc' : (isBloodMoon ? '#ef4444' : '#22d3ee')),
            emissiveIntensity: isAcidRain ? 0.5 : (isAurora ? 3 : 2)
        });

        const emissivePink = getCachedMaterial(`e-pink-${weatherSuffix}`, {
            color: isAcidRain ? '#a855f7' : (isAurora ? '#e879f9' : (isBloodMoon ? '#7f1d1d' : '#e879f9')),
            emissive: isAcidRain ? '#a855f7' : (isAurora ? '#e879f9' : (isBloodMoon ? '#7f1d1d' : '#e879f9')),
            emissiveIntensity: isAcidRain ? 0.5 : 2
        });

        return { concrete, metal, primary, glass, emissiveCyan, emissivePink };
    }, [weather, baseColor, isSnowing, isAcidRain, isSandstorm, isToxicSmog, isBloodMoon, isHeatwave, isRaining, isAurora, isStardust]);

    const content = useMemo(() => {
        const common = { castShadow: true, receiveShadow: true };
        const { concrete, metal, primary, glass, emissiveCyan, emissivePink } = materials;

        switch (type) {
            case BuildingType.Residential:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={concrete} position={[0, 0.3, 0]} scale={[0.8, 0.6, 0.8]} />
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0.1, 0.7, 0.1]} scale={[0.6, 0.5, 0.6]} />
                        <mesh {...common} geometry={boxGeo} material={metal} position={[-0.1, 1.1, -0.1]} scale={[0.5, 0.5, 0.5]} />
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0.1, 0.7, 0.41]} scale={[0.2, 0.2, 0.05]} />
                    </group>
                );
            case BuildingType.Apartment:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={metal} position={[0, buildingHeight * 0.8, 0]} scale={[0.6, buildingHeight * 1.6, 0.6]} />
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0.2, buildingHeight * 0.5, 0]} scale={[0.5, 0.3, 0.7]} />
                        <mesh {...common} geometry={boxGeo} material={primary} position={[-0.2, buildingHeight * 1.0, 0]} scale={[0.5, 0.3, 0.7]} />
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, buildingHeight * 1.4, 0.2]} scale={[0.7, 0.3, 0.4]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0, buildingHeight * 1.6 + 0.1, 0]} scale={[0.1, 0.4, 0.1]} />
                    </group>
                );
            case BuildingType.Commercial:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={metal} position={[0, 0.5 * buildingHeight, 0]} scale={[0.9, buildingHeight, 0.9]} />
                        <mesh geometry={boxGeo} material={glass} position={[0, 0.5 * buildingHeight, 0.46]} scale={[0.85, buildingHeight * 0.9, 0.1]} />
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, buildingHeight, 0.5]} scale={[0.9, 0.2, 0.1]} />
                        <mesh geometry={boxGeo} material={concrete} position={[0.5, 0.2, 0]} scale={[0.1, 0.8, 0.8]} />
                    </group>
                );
            case BuildingType.Industrial:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={metal} position={[0, 0.4, 0]} scale={[0.95, 0.8, 0.95]} />
                        <mesh {...common} geometry={cylinderGeo} material={concrete} position={[0.25, 0.9, 0.25]} scale={[0.15, 0.6, 0.15]} />
                        <mesh {...common} geometry={cylinderGeo} material={concrete} position={[-0.25, 0.8, -0.25]} scale={[0.12, 0.8, 0.12]} />
                        <mesh geometry={sphereGeo} material={emissiveCyan} position={[0, 0.4, 0]} scale={[0.3, 0.3, 0.3]} />
                    </group>
                );
            case BuildingType.Park:
                const grassMat = getCachedMaterial(`grass-${weather || 'CLEAR'}`, {
                    color: isSnowing ? '#f1f5f9' : (isAcidRain ? '#3f6212' : '#4ade80'),
                    roughness: isRaining ? 0.3 : 0.8
                });
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={grassMat} position={[0, 0.05, 0]} scale={[0.95, 0.1, 0.95]} />
                        <mesh {...common} geometry={cylinderGeo} material={concrete} position={[0.2, 0.2, 0.2]} scale={[0.05, 0.3, 0.05]} />
                        <mesh {...common} geometry={sphereGeo} material={primary} position={[0.2, 0.4, 0.2]} scale={[0.2, 0.2, 0.2]} />
                        <mesh geometry={cylinderGeo} material={glass} position={[-0.1, 0.15, 0.3]} scale={[0.2, 0.1, 0.2]} />
                    </group>
                );
            case BuildingType.MegaMall:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.6, 0]} scale={[1, 1.2, 1]} />
                        <mesh geometry={boxGeo} material={glass} position={[0, 0.6, 0.51]} scale={[0.9, 1, 0.05]} />
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, 1.3, 0]} scale={[1.1, 0.1, 1.1]} />
                    </group>
                );
            case BuildingType.Police:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.4, 0]} scale={[0.9, 0.8, 0.9]} />
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0, 0.85, 0]} scale={[0.8, 0.1, 0.8]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0.2, 0.9, 0.2]} scale={[0.05, 0.4, 0.05]} />
                    </group>
                );
            case BuildingType.FireStation:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.4, 0]} scale={[0.9, 0.8, 0.9]} />
                        <mesh geometry={boxGeo} material={metal} position={[0, 0.3, 0.41]} scale={[0.7, 0.4, 0.1]} />
                        <mesh geometry={sphereGeo} material={emissivePink} position={[0, 0.85, 0]} scale={[0.1, 0.1, 0.1]} />
                    </group>
                );
            case BuildingType.School:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={concrete} position={[0, 0.3, 0]} scale={[0.9, 0.6, 0.9]} />
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.7, 0]} scale={[0.7, 0.4, 0.7]} />
                        <mesh geometry={cylinderGeo} material={metal} position={[0, 1.0, 0]} scale={[0.05, 0.3, 0.05]} />
                    </group>
                );
            case BuildingType.Hospital:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.6, 0]} scale={[0.9, 1.2, 0.9]} />
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, 1.0, 0.46]} scale={[0.4, 0.1, 0.1]} />
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, 1.0, 0.46]} scale={[0.1, 0.4, 0.1]} />
                        <mesh geometry={cylinderGeo} material={glass} position={[0, 1.25, 0]} scale={[0.6, 0.1, 0.6]} />
                    </group>
                );
            case BuildingType.Road:
                const roadMat = getCachedMaterial(`road-${weather || 'CLEAR'}`, {
                    color: isSnowing ? '#94a3b8' : '#1f2937'
                });
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={roadMat} position={[0, 0.01, 0]} scale={[1, 0.02, 1]} />
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0, 0.021, 0]} scale={[0.1, 0.01, 0.6]} />
                    </group>
                );
            case BuildingType.GoldMine:
                const dirtMat = getCachedMaterial(`dirt-${weather || 'CLEAR'}`, { color: '#451a03' });
                const goldMat = getCachedMaterial('gold', { color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.5 });
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={dirtMat} position={[0, 0.4, 0]} scale={[1, 0.8, 1]} />
                        <mesh geometry={boxGeo} material={goldMat} position={[0, 0.85, 0]} scale={[0.2, 0.1, 0.2]} />
                    </group>
                );
            case BuildingType.Mansion:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.3, 0]} scale={[1, 0.6, 1]} />
                        <mesh {...common} geometry={cylinderGeo} material={primary} position={[0.3, 0.8, 0.3]} scale={[0.2, 1, 0.2]} />
                        <mesh {...common} geometry={cylinderGeo} material={primary} position={[-0.3, 0.8, -0.3]} scale={[0.2, 1, 0.2]} />
                        <mesh geometry={sphereGeo} material={glass} position={[0, 0.7, 0]} scale={[0.3, 0.3, 0.3]} />
                    </group>
                );
            case BuildingType.SpacePort:
                return (
                    <group>
                        <mesh {...common} geometry={cylinderGeo} material={metal} position={[0, 0.1, 0]} scale={[1, 0.2, 1]} />
                        <mesh {...common} geometry={cylinderGeo} material={concrete} position={[0, 1.0, 0]} scale={[0.3, 1.8, 0.3]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0, 1.9, 0]} scale={[0.32, 0.1, 0.32]} />
                    </group>
                );
            case BuildingType.ResearchCentre:
                return (
                    <group>
                        <mesh {...common} geometry={sphereGeo} material={glass} position={[0, 0.8, 0]} scale={[0.8, 0.8, 0.8]} />
                        <mesh {...common} geometry={boxGeo} material={metal} position={[0, 0.2, 0]} scale={[1, 0.4, 1]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0, 0.8, 0]} scale={[0.1, 1.2, 0.1]} />
                    </group>
                );
            case BuildingType.Stadium:
                const fieldMat = getCachedMaterial(`field-${weather || 'CLEAR'}`, { color: isSnowing ? '#ffffff' : '#166534' });
                return (
                    <group>
                        <mesh {...common} geometry={cylinderGeo} material={concrete} position={[0, 0.3, 0]} scale={[1, 0.6, 1]} />
                        <mesh geometry={cylinderGeo} material={fieldMat} position={[0, 0.61, 0]} scale={[0.8, 0.01, 0.8]} />
                        <mesh {...common} geometry={cylinderGeo} material={primary} position={[0, 0.5, 0]} scale={[1.1, 0.2, 1.1]} />
                    </group>
                );
            case BuildingType.Casino:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.5, 0]} scale={[1, 1, 1]} />
                        <mesh geometry={boxGeo} material={emissivePink} position={[0, 0.5, 0.51]} scale={[0.8, 0.8, 0.05]} />
                        <mesh geometry={cylinderGeo} material={emissiveCyan} position={[0.4, 1.1, 0.4]} scale={[0.1, 0.4, 0.1]} />
                    </group>
                );
            case BuildingType.Bridge:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={concrete} position={[0, 0.45, 0]} scale={[1, 0.1, 1]} />
                        <mesh {...common} geometry={boxGeo} material={concrete} position={[0, 0.25, 0.4]} scale={[1, 0.5, 0.1]} />
                        <mesh {...common} geometry={boxGeo} material={concrete} position={[0, 0.25, -0.4]} scale={[1, 0.5, 0.1]} />
                    </group>
                );
            case BuildingType.University:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={concrete} position={[0, 0.4, 0]} scale={[1, 0.8, 1]} />
                        <mesh {...common} geometry={boxGeo} material={primary} position={[0, 0.9, 0]} scale={[0.6, 0.4, 0.6]} />
                        <mesh geometry={cylinderGeo} material={concrete} position={[0.4, 0.6, 0.4]} scale={[0.1, 1.2, 0.1]} />
                        <mesh geometry={cylinderGeo} material={concrete} position={[-0.4, 0.6, 0.4]} scale={[0.1, 1.2, 0.1]} />
                    </group>
                );
            default:
                return (
                    <group>
                        <mesh {...common} geometry={boxGeo} material={metal} position={[0, 0.4 * buildingHeight, 0]} scale={[0.7, 0.8 * buildingHeight, 0.7]} />
                        <mesh geometry={boxGeo} material={emissiveCyan} position={[0, 0.7 * buildingHeight, 0]} scale={[0.75, 0.05, 0.75]} />
                    </group>
                );
        }
    }, [type, buildingHeight, materials, isSnowing, isRaining, isAcidRain, weather, baseColor]);

    const warningIndicatorContent = useMemo(() => {
        return null; // Road access is no longer required
        /*
        if (hasRoadAccess !== false) return null;
        return (
            <group position={[0, 1.8, 0]}>
                <Float speed={5} rotationIntensity={0} floatIntensity={0.5}>
                    <mesh>
                        <sphereGeometry args={[0.15]} />
                        <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
                    </mesh>
                </Float>
                <mesh position={[0, -0.6, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.4} />
                </mesh>
            </group>
        );
        */
    }, [hasRoadAccess]);

    return (
        <group
            position={position}
            rotation={[0, rotation, 0]}
            scale={isHovered ? 1.05 : 1}
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        >
            {content}
            {warningIndicatorContent}
        </group>
    );
});
