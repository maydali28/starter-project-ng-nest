const { getAffectedLibs, pexec } = require('./utils');

const libs = getAffectedLibs();
(async () => {
  try {
    console.log(libs.join(''));
    await pexec(`yarn nx test ${libs.join(' ')}`).then(res => {
      console.log(res);
    });
  } catch (e) {
    console.error(e);
  }
})();
