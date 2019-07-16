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

