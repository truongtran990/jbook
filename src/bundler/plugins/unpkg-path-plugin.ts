import localforage from "localforage";

import * as esbuild from "esbuild-wasm";

export const fileCache = localforage.createInstance({
  // configuration object
  name: "filecache",
});

export const unpkgPathPlugin = () => {
  // return a object is a plugin that works inside of its esbuild.
  /* 
  return an object
    - name (string): for debugging
    - setup (function):
        + is going to be called automatically by esbuild with a single argument - build
            + build argument: represents the building process: the entire process is: 
                + finding some file
                + parsing it
                + transpiling it
                + joining a bunch of different files together
            + we can override behaviour of build process with .onResolve, .onLoad

  */
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      /* 
      trying to figure out where the file is stored or what the actual path to the file  
      */
      //  Handle root entry file of index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return {
          path: "index.js",
          namespace: "a",
        };
      });

      // Handle relative paths in module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            ?.href,
        };
      });

      // handle main file of module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
        /* else if (args.path === "tiny-test-pkg") {
          return {
            path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js",
            namespace: "a",
          };
        } */
      });
    },
  };
};
