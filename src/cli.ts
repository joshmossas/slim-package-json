#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { generateSlimPackageJson } from '.';

const slimPackageJson = defineCommand({
    args: {
        dir: {
            type: 'string',
            alias: 'D',
            required: true,
            description: 'The directory where the built js/ts files are',
        },
        packageJson: {
            type: 'string',
            alias: 'P',
            required: true,
            description:
                'Location of your package.json that contains all the potential dependencies. Usually this is at the monorepo root.',
        },
        extendFrom: {
            type: 'string',
            alias: 'E',
            description:
                'A package.json that you want to inherit properties from',
        },
    },
    async run({ args }) {
        return generateSlimPackageJson(args);
    },
});

void runMain(slimPackageJson);
