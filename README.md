# jupyterlab-tutorial

A package which provides a tutorial manager for incorporating interactive tutorials within JupyterLab.
Front-end components provided by React Joyride: https://github.com/gilbarbara/react-joyride

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install jupyterlab-tutorial
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

## Steps to test npm package without publishing (MacOS):
1.  Go to the package repository/directory
```bash
cd <package/directory>
```

2. Prepare the tar package with npm
```bash
npm pack
```

3. Copy the package to home directory for simplicity
```bash
cp jupyterlab-tutorial-<version>.tgz ~
#Copy the package to the cache folder too if testing in JupyterLab:
cp jupyterlab-tutorial-extension-<version>.tgz ~/Library/Caches
```

5. Go to the project directory where the package is needed for testing
```bash
cd <project/where/you/need/package>
```

6. Install the package using the home directory
```
npm install ~/jupyterlab-tutorial-<version>.tgz
```