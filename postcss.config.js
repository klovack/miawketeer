import postCssAutoreset from "postcss-autoreset";
import postCssInitial from "postcss-initial";
import autoprefixer from "autoprefixer";

const postCssConfig = {
  syntax: "postcss-scss",
  parser: "postcss-scss",
  plugins: [postCssAutoreset(), postCssInitial(), autoprefixer()],
};
