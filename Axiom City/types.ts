/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- Enums ---

export enum BuildingType {
  None = 'None',
  Road = 'Road',
  Residential = 'Residential',
  Commercial = 'Commercial',
  Industrial = 'Industrial',
  Park = 'Park',
  School = 'School',
  Hospital = 'Hospital',
  Police = 'Police',
  FireStation = 'FireStation',
  GoldMine = 'GoldMine',
  Apartment = 'Apartment',
  Mansion = 'Mansion',
  Water = 'Water',
  Bridge = 'Bridge'
}

export enum EconomicEvent {
  None = 'NONE',
  Boom = 'BOOM', // High tax revenue, high share price
  Recession = 'RECESSION', // Low revenue, share crash
  Strike = 'STRIKE', // No commercial/industrial income
  Audit = 'AUDIT', // One-time fine, frozen accounts?
}

export enum WeatherType {
  Clear = 'CLEAR',
  Rain = 'RAIN',
  Snow = 'SNOW',
  AcidRain = 'ACID_RAIN',
  Fog = 'FOG'
}

export enum DisasterType {
  None = 'NONE',
  Meteor = 'METEOR',
  AlienInvasion = 'ALIEN_INVASION',
  SolarFlare = 'SOLAR_FLARE'
}

export interface ActiveDisaster {
  type: DisasterType;
  position: { x: number, y: number } | null; // Null for global disasters like Solar Flare
  startTime: number;
  duration: number; // In ticks or ms
  stage: 'WARNING' | 'ACTIVE' | 'AFTERMATH';
}

// --- Interfaces ---

export interface BuildingConfig {
  type: BuildingType;
  cost: number;
  name: string;
  description: string;
  color: string;
  popGen: number;
  incomeGen: number;
}

export interface TileData {
  x: number;
  y: number;
  buildingType: BuildingType;
}

export type Grid = TileData[][];

export interface CityStats {
  money: number;
  population: number;
  day: number;

  housingCapacity: number;

  // Advanced Simulation Stats
  taxRate: number; // 0.0 to 1.0
  happiness: number; // 0 to 100
  education: number; // 0 to 100
  safety: number; // 0 to 100

  budget: {
    income: number;
    expenses: number;
    details: {
      tax: number;
      business: number;
      export: number;
      services: number;
      welfare: number;
      construction: number; // Currently not tracked in simulation step but useful
    };
  };

  demographics: {
    children: number;
    adults: number;
    seniors: number;
  };
  jobs: {
    commercial: number;
    industrial: number;
    total: number;
    unemployment: number;
  };

  // Deeper Economy
  shadowEconomy: number; // 0 to 1
  supplyLevel: number; // 0 to 1
  loanPrincipal: number;
  loanInterestRate: number;

  // Volatility & Risk
  activeEvent: EconomicEvent;
  eventDuration: number;
  sharePrice: number;
  investmentShares: number;
  investmentAverageCost: number;
}

export interface AIGoal {
  description: string;
  targetType: 'population' | 'money' | 'building_count';
  targetValue: number;
  buildingType?: BuildingType; // If target is building_count
  reward: number;
  completed: boolean;
}

export interface NewsItem {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
}

// --- Events & Decisions ---
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'weird' | 'disaster' | 'opportunity';
  choices: {
    label: string;
    effectDescription: string;
    onSelect: () => void; // Handled in logic
  }[];
}

export interface AIAction {
  action: 'BUILD' | 'DEMOLISH' | 'WAIT';
  buildingType?: BuildingType;
  x?: number;
  y?: number;
  reasoning?: string;
  failedAttempt?: { x: number, y: number };
}