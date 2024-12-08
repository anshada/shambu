import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    entry: {
      index: 'src/index.ts'
    },
    resolve: true,
    compilerOptions: {
      incremental: true,
      tsBuildInfoFile: './dist/.tsbuildinfo'
    }
  },
  clean: true,
  external: [
    '@radix-ui/react-slider',
    '@radix-ui/react-select',
    '@radix-ui/react-label',
    '@supabase/supabase-js',
    'react'
  ],
  treeshake: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  skipNodeModulesBundle: true,
  outDir: 'dist'
}); 