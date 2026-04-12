# Slim Package Json

A cli tool for creating generating a package.json for containers that only includes the dependencies that were actually used

## Installation

```bash
# global install
npm i -g slim-package-json

# local install
npm i slim-package-json
```

## Cli-Usage

```bash
# get complete list of options
slim-package-json --help

# basic usage
slim-package-json --package-json ./package.json --dir ./path/to/output/dir
slim-package-json -P ./package.json -D ./path/to/output/dir

# inherit properties from a child package.json
slim-package-json --package-json ./package.json --child-package-json ./apps/foo/package.json --dir ./apps/foo/dist
slim-package-json -P ./package.json -C ./apps/foo/package.json -D ./apps/foo/dist
```

## TS Usage

```ts
import { generatePackageJson } from 'slim-package-json';

generatePackageJson({
    packageJson: './package.json',
    dir: './path/to/output/dir',
});
```
