import * as migration_20250918_235319 from './20250918_235319';

export const migrations = [
  {
    up: migration_20250918_235319.up,
    down: migration_20250918_235319.down,
    name: '20250918_235319'
  },
];
