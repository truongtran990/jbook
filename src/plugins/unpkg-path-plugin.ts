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
        console.log("onResole", args);

        // return that path
        return { path: args.path, namespace: "a" };
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
            contents: `
              import message from './message';
              console.log(message);
            `,
          };
        } else {
          return {
            loader: "jsx",
            // hard code for the content of message.js
            contents: 'export default "hi there!"',
          };
        }
      });
    },
  };
};
