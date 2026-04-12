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
        childPackageJson: {
            type: 'string',
            alias: 'C',
            description:
                'Location of the package.json for the child project within the monorepo. If specified the generated package json will inherit all the properties from this package json.',
        },
    },
    async run({ args }) {
        return generateSlimPackageJson(args);
    },
});

void runMain(slimPackageJson);
