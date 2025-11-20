require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
  extensions: [".js", ".jsx"]
});

import("./src/features/contacts/actions/index.js").then(a =>
  console.log(Object.keys(a))
);
