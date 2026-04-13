import { describe, expect, test } from 'vitest';
import { addUsedDependencies, PackageJson } from '.';

describe('addUsedDependencies', () => {
    test('esm imports', () => {
        const filecontents = [
            `import {foo} from 'foo';`,
            `import { bar } from "bar";`,
        ];
        const packageJson: PackageJson = {
            dependencies: {
                foo: '1.0.0',
                bar: '1.1.1',
                baz: '2.68.0-beta2',
            },
        };
        const projectPackageJson: PackageJson = {};
        for (const content of filecontents) {
            addUsedDependencies(content, packageJson, projectPackageJson);
        }
        expect(projectPackageJson).toStrictEqual({
            dependencies: { foo: '1.0.0', bar: '1.1.1' },
        });
    });
    test('cjs require()', () => {
        const filecontents = [
            `const foo = require('foo');`,
            `const bar = require("bar");`,
        ];
        const packageJson: PackageJson = {
            dependencies: {
                foo: '1.0.0',
                bar: '1.1.1',
                baz: '2.68.0-beta2',
            },
        };
        const projectPackageJson: PackageJson = {};
        for (const content of filecontents) {
            addUsedDependencies(content, packageJson, projectPackageJson);
        }
        expect(projectPackageJson).toStrictEqual({
            dependencies: { foo: '1.0.0', bar: '1.1.1' },
        });
    });
});
