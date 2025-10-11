const fs = require("fs");
const path = require("path");

const template = (name) => {
  return {
    name: `@develop-plugins/${name}`,
    version: "0.0.1",
    description: "",
    main: "dist/index.js",
    type: "module",
    scripts: {
      build: "vite build --config ../base.config.js",
      prepublishOnly: "npm run build & node ../version.js",
    },
    keywords: ["vue3"],
    author: "xx",
    license: "ISC",
    exports: {
      ".": {
        import: "./dist/index.js",
      },
      "./style.css": "./dist/style.css",
    },
    files: ["dist"],
    homepage: "https://312472644.github.io/",
    publishConfig: {
      access: "public",
      registry: "https://registry.npmjs.org/",
    },
    engines: {
      node: ">=18",
    },
    peerDependencies: {
      vue: "^3.0.0",
    },
    devDependencies: {
      terser: "^5.31.1",
    },
  };
};

const generatePackage = () => {
  let name = process.argv.pop();
  if (!name) {
    name = "x-demo";
  } else {
    name = name.split("=").pop();
  }
  const dir = path.join(process.cwd(), "package.json");
  if (fs.existsSync(dir)) {
    fs.unlinkSync(dir);
  }
  const content = JSON.stringify(template(name), null, 2);
  fs.writeFileSync(dir, content);
};

generatePackage();
