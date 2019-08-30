const { readdir } = require('fs-extra');
const { pexec } = require('./utils');

const publishLibs = async dirs => {
  for (let dir of dirs) {
    console.log(dir);
    const publishResult = await pexec(
      `npm publish @starter-project-ng-nest/${dir}`
    );
  }
};

(async () => {
  const dirs = await readdir('./@starter-project-ng-nest');
  await publishLibs(dirs);
})();
