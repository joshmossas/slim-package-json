import { readFile, writeFile } from 'fs/promises';
import { globby } from 'globby';
import path from 'path';

export type PackageJson = {
    [key: string]: unknown;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
};

export type GeneratePackageJsonArgs = {
    /**
     * The package json containing all the potential dependencies
     */
    packageJson: string;
    /**
     * package.json of a sub package in the monorepo that you want to inherit properties from
     */
    childPackageJson?: string;
    /**
     * directory to check for used dependencies
     */
    dir: string;
};

export async function generateSlimPackageJson(args: GeneratePackageJsonArgs) {
    console.info(`Loading file(s)`);
    const workspacePackageJson = JSON.parse(
        await readFile(path.resolve(args.packageJson), {
            encoding: 'utf8',
        }),
    ) as PackageJson;
    const projectPackageJson = args.childPackageJson
        ? (JSON.parse(
              await readFile(path.resolve(args.childPackageJson), {
                  encoding: 'utf8',
              }),
          ) as PackageJson)
        : {};
    const files = await globby(
        [
            '**/*.js',
            '**/*.jsx',
            '**/*.ts',
            '**/*.tsx',
            '**/*.mjs',
            '**/*.mts',
            '**/*.cjs',
            '**/*.cts',
        ],
        { cwd: path.resolve(args.dir) },
    );
    console.info(`Found ${files.length} file(s)`);
    console.info(`Detecting used dependencies`);
    const tasks = files.map(async (file) => {
        const fileContent = await readFile(path.resolve(args.dir, file), {
            encoding: 'utf8',
        });
        addUsedDependencies(
            fileContent,
            workspacePackageJson,
            projectPackageJson,
        );
    });
    await Promise.all(tasks);
    console.info(
        `Detected ${Object.keys(projectPackageJson.dependencies ?? {}).length} used dependencies`,
    );
    const outputFile = path.resolve(args.dir, 'package.json');
    await writeFile(outputFile, JSON.stringify(projectPackageJson), {
        encoding: 'utf8',
    });
    console.info(`Successfully wrote package.json to ${outputFile}`);
}

function addUsedDependencies(
    fileContent: string,
    rootPackageJson: PackageJson,
    childPackageJson: PackageJson,
) {
    for (const [key, val] of Object.entries(
        rootPackageJson.dependencies ?? {},
    )) {
        if (
            fileContent.includes(`from '${key}`) ||
            fileContent.includes(`from "${key}`) ||
            fileContent.includes(`require('${key}`) ||
            fileContent.includes(`require("${key})`)
        ) {
            if (!childPackageJson.dependencies) {
                childPackageJson.dependencies = {};
            }
            childPackageJson.dependencies[key] = val;
        }
    }
    for (const [key, val] of Object.entries(
        rootPackageJson.devDependencies ?? {},
    )) {
        if (
            fileContent.includes(`from '${key}`) ||
            fileContent.includes(`from "${key}`) ||
            fileContent.includes(`require('${key}`) ||
            fileContent.includes(`require("${key})`)
        ) {
            if (!childPackageJson.dependencies) {
                childPackageJson.dependencies = {};
            }
            childPackageJson.dependencies[key] = val;
        }
    }
}
