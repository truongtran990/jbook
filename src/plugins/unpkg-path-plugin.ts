import axios from "axios";

import * as esbuild from "esbuild-wasm";

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
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);

        // return that path
        if (args.path === "index.js") {
          return {
            path: args.path,
            namespace: "a",
          };
        }
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

      /* 
      defining listeners, overriding the es natural way of loading up a file, which is to just read it directly off a file system
      instead: dont try to load up this file off the file system, were just going to return an object for you immediately that contains the contents of that file we're trying to load.
      */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        /* 
        if the file is index.js, don't let it try to load up something on the filesystem instead, we're loading for you.
        */
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            // hard code for the content of the index.js
            // we have a problem at here: that is we can not import package direct from npm
            contents: `
              const message = require('tiny-test-pkg');
              console.log(message);
            `,
          };
        }

        const { data } = await axios.get(args.path);
        console.log("data: ", data);
        return {
          loader: "jsx",
          contents: data,
        };
      });
    },
  };
};
