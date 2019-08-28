import { configure } from "@storybook/angular";
import "@storybook/addon-console";

import "!style-loader!css-loader!../stories/stories.scss"; // for scss

// automatically import all files ending in *.stories.ts
const req = require.context("../stories", true, /\.stories\.ts$/);
function loadStories() {
  req
    .keys()
    .sort()
    .forEach(filename => req(filename));
}

configure(loadStories, module);
