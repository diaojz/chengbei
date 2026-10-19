# npm, npx, and Node.js: Making Sense of Similar Terminal Commands

When you start building with an AI coding assistant, the terminal can feel like a vocabulary test. One instruction says `npm install`, the next says `npx create-vite`, and another says `npm run dev`. Then you are told to commit a lockfile, but never commit node_modules.

These tools and files have different jobs. Understanding those jobs makes it easier to read an assistant's proposed commands and describe exactly where something failed.

> Sources checked on October 19, 2026, against official Node.js material and npm CLI v11 documentation. Options, download confirmation, and install-script policies can vary by version. These examples describe behavior; they have not been run on your computer.

## 1. The language, runtime, package manager, and command runner

| Name | Job |
|---|---|
| JavaScript | The programming language |
| Node.js | A runtime that executes JavaScript outside the browser |
| npm | A CLI for dependency management, scripts, and publishing; the name also refers to its wider ecosystem and services |
| npx | Runs commands supplied by npm packages; modern versions use `npm exec` |
| npm registry | A service that stores and distributes packages |

Browsers and Node.js both run JavaScript, but offer different environments. Browsers provide the webpage DOM; Node.js offers capabilities such as filesystem access. Installing Node.js does not install a browser.

Common Node.js installation methods also supply npm and npx, although this depends on the distribution. Check what your terminal can find:

```bash
node --version
npm --version
npx --version
```

Their version numbers need not match. If a command cannot be found, check installation and PATH—the locations your shell searches for programs—before changing application code.

## 2. A package name is not necessarily a command name

A **package** is a unit of distribution and installation. When your project needs a package, it becomes a **dependency**.

A package may contain library code, terminal commands, or both. Lodash is commonly used as a library. The `typescript` package provides the `tsc` compiler command. Vite provides a command with the same name as its package.

Executable entry points are declared in a package's `bin` field. This distinction explains the explicit command below:

```bash
npx --package typescript tsc --version
```

It selects the `typescript` package and runs `tsc --version`. Do not assume `npx tsc` explicitly selects that package: another package may use the command's name on the registry.

## 3. Three actions: install dependencies, run scripts, execute tools

### npm install prepares dependencies

Inside an existing project:

```bash
npm install
```

npm uses `package.json` and the existing lockfile to resolve and install dependencies. A compatible lockfile can supply the resolved versions; when declarations differ, `npm install` may update the lockfile.

To add packages:

```bash
npm install lodash
npm install -D typescript
```

The first saves a normal dependency under `dependencies`. `-D`, short for `--save-dev`, saves a development dependency under `devDependencies`, commonly used for build, checking, and testing tools.

A development dependency can still be needed during deployment. If the deployment environment builds the frontend, it may need Vite or TypeScript there. The distinction depends on where you build and what the running application needs.

### npm run executes a script defined by the project

Consider this part of `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

These commands run the corresponding entries:

```bash
npm run dev
npm run build
npm run preview
```

The project author chooses the names and their contents. Not every project has a `dev` script, and `build` does not do the same thing everywhere. Run `npm run` without a script name to list the available scripts.

npm adds `node_modules/.bin` to the script's PATH. A script can therefore call the project's local Vite without requiring a global installation.

To pass arguments through to a script:

```bash
npm run dev -- --port 5173
```

Here Vite receives `--port 5173`. Whether an option is supported depends on the underlying tool.

### npx finds a tool and executes it

```bash
npx create-vite@latest
```

This is convenient for project generators and occasional CLI tools. Modern npx uses `npm exec`. A matching project dependency can be used locally; otherwise, a requested package may be installed into npm's cache and added to the execution environment's PATH.

**npx does not mean “nothing gets installed.”** It usually avoids adding the temporary tool to your project's dependencies or global installation directory. Cached packages may remain available for later reuse.

Interactive downloads normally prompt, but options, noninteractive environments, and versions affect confirmation behavior. `-y` / `--yes` skips the download confirmation; it does not establish that a package is trustworthy.

These commands have similar purposes:

```bash
npx eslint .
npm exec -- eslint .
```

Argument parsing differs, so complex commands should not be converted by simply replacing their prefixes. To specify both package and command explicitly:

```bash
npm exec --package typescript -- tsc --version
```

Also, `latest` is a publisher-managed distribution tag. The version it points to can change. For team workflows, manage tools through appropriate explicit versions, project dependencies, and lockfiles.

## 4. The manifest, lockfile, and installed files

```text
my-project/
├── package.json
├── package-lock.json
└── node_modules/
```

| File or directory | Contents | Usually committed? |
|---|---|---|
| `package.json` | Metadata, scripts, dependencies, and version requirements | Yes |
| `package-lock.json` | Resolved dependency tree, exact versions, and related metadata | Usually, for npm projects |
| `node_modules/` | Installed dependency files | Usually no |

The manifest may allow a version range; the lockfile records the resolved result. This helps teammates and deployment systems install consistent dependencies without committing the installed directory.

A consistent dependency tree is not a completely identical environment. Node.js versions, operating systems, CPU architectures, install options, and external services can still affect the result.

## 5. npm install versus npm ci

Use `npm install` while adding or changing dependencies. Automated deployment often uses:

```bash
npm ci
```

This requires an existing `package-lock.json` or supported shrinkwrap file matching the manifest. If the dependency declarations disagree, it fails instead of updating the lockfile.

It also removes an existing `node_modules` directory before installing, and does not rewrite the manifest or lockfile.

| Goal | Common choice |
|---|---|
| Prepare a new project without a lockfile | `npm install` |
| Add a dependency | `npm install package-name` |
| Perform a clean installation from a committed lockfile | `npm ci` |
| Resolve an intentional dependency change | Investigate, update with `npm install`, and review the diff |

Options that affect dependency-tree shape must remain compatible with those used when creating the lockfile. Deleting the lockfile as a reflex can introduce many unrelated version changes.

## 6. Local, global, and temporary execution

```bash
# Add a project development dependency
npm install -D typescript

# Install globally, at the location determined by npm configuration
npm install -g typescript

# Select the package for this command execution
npx --package typescript tsc --version
```

Global tools can be useful for frequently used personal CLIs. However, “global” does not mean every user and every Node.js installation shares one copy. Switching Node.js installations or version-manager environments can change which tools are available, and PATH still matters.

Project build tools generally belong in local dependencies and scripts so the team can share versions. npx works well for occasional generators; global installation can suit everyday personal tools.

You may also encounter pnpm, Yarn, and Bun. pnpm and Yarn manage JavaScript dependencies and scripts. Bun includes a runtime and package manager among other tools. Their options, versions, and lock formats differ.

In an existing project, read the README, the `packageManager` field if present, and its lockfile before choosing a tool. If you see `pnpm-lock.yaml` or `yarn.lock`, follow the project's convention instead of immediately creating another lockfile with npm. Multiple lockfiles require clarification about which one the project actually uses.

## 7. Putting the steps together

Here is a Vite example, assuming you want to download and execute the official `create-vite` generator. Follow its current Node.js requirements and prompts:

```bash
# Generate a project and select a template
npx create-vite@latest my-demo

# Enter the generated directory
cd my-demo

# Install dependencies if the generator has not already done so
npm install

# Run the project's development script
npm run dev
```

These are four different actions: generate files, change directories, install dependencies, and run a script. A generator may offer to install or start the project for you; do not repeat completed steps mechanically.

Open the actual address printed by the development server. A tool may choose another port when the requested port is occupied.

For a production release, typically run `npm run build` and deploy the output. In this example, `npm run preview` previews the built result locally. It does not publish the site and is not a production hosting plan.

| Symptom | Check first |
|---|---|
| `node` or `npm` cannot be found | Installation, shell, and PATH |
| No `package.json` found | Current project directory |
| `Missing script: dev` | Whether the manifest defines that script |
| Dependency installation fails | Registry, network, version, and dependency-conflict details in the log |
| `npm ci` reports a lockfile mismatch | Manifest, lockfile, and installation configuration |
| npx cannot determine an executable | Whether the package provides a command and whether its name differs |

“Dependencies did not install” and “dependencies installed, but the dev script failed” are different problems. Naming the failing step gives both you and your AI assistant a better starting point.

## Official sources

- [Node.js and browser differences](https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser)
- [npm exec / npx](https://docs.npmjs.com/cli/v11/commands/npm-exec)
- [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install)
- [npm run](https://docs.npmjs.com/cli/v11/commands/npm-run)
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)
- [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- [package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json)
