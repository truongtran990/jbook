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
      // exactly load index.js file
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        console.log("onLoad");
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      // load file which is ended with .css
      build.onLoad({ filter: /\.css$/ }, async (args: any) => {
        console.log("onLoad", args);
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);

        const escaped = data
          // remove new line by ""
          .replace(/\n/g, "")
          // replace " => \"
          .replace(/"/g, '\\"')
          // replace ' => \'
          .replace(/'/g, "\\'");

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

        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

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
