import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: ['./src/index.ts', './src/cli.ts'],
    outDir: 'dist',
    declaration: true,
    rollup: {
        emitCJS: true,
    },
});
