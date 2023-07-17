import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

export const fileCache = localforage.createInstance({
  // configuration object
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      /* 
      HOW onLoad function works behind the scenes ???

      1. we register function that to be executed, and that function only ran when we have the file we try to resolve or load up that matches that given filter

      2. we are not required to return a result from an onLoad function

      3. if onLoad function does not return an real object -> the execution is going to continue on the next onLoad function that matching filter
      */

      // exactly load index.js file
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        console.log("onLoad");
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("I ran but didn't do any thing");
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        /* 
        if not return object the execution is going to continue on the next onLoad function that matching filter
        */
        if (cachedResult) {
          return cachedResult;
        }
      });

      // load file which is ended with .css
      build.onLoad({ filter: /\.css$/ }, async (args: any) => {
        console.log("onLoad", args);

        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, "") // remove new line by ""
          .replace(/"/g, '\\"') // replace " => \"
          .replace(/'/g, "\\'"); // replace ' => \'

        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          // we get the directory to the main file of library like this: https://unpkg.com/nested-test-pkg.com@17.0.1/src/index.js ==> /nested-test-pkg@1.0.0/src/
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // set the fetched data into localforage
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          // we get the directory to the main file of library like this: https://unpkg.com/nested-test-pkg.com@17.0.1/src/index.js ==> /nested-test-pkg@1.0.0/src/
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // set the fetched data into localforage
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
