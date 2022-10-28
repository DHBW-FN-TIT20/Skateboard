# Skateboard
A 3D Animation of a skateboard for computergraphics.
The local server runs with [VITE](https://vitejs.dev/).

## Setup
```console
npm ci
```

## Run
Run VITE with:
```console
npm run dev
```

If this error occurs: 
```console
You installed esbuild for another platform than the one you're currently using.
```
This won't work because esbuild is written with native code and needs to install a platform-specific binary executable.
 &rarr; remove the node_modules directory and reinstall with:
```console
rm node_modules -rf
npm ci
```