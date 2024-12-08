import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['@radix-ui/react-slider', '@radix-ui/react-select', '@radix-ui/react-label'],
  treeshake: true,
  sourcemap: true,
}); 