import * as migration_20250918_235319 from './20250918_235319';
import * as migration_20250919_145557 from './20250919_145557';
import * as migration_20251002_214214 from './20251002_214214';

export const migrations = [
  {
    up: migration_20250918_235319.up,
    down: migration_20250918_235319.down,
    name: '20250918_235319',
  },
  {
    up: migration_20250919_145557.up,
    down: migration_20250919_145557.down,
    name: '20250919_145557',
  },
  {
    up: migration_20251002_214214.up,
    down: migration_20251002_214214.down,
    name: '20251002_214214'
  },
];
