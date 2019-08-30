const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { parseFiles } = require('@nrwl/workspace/src/command-line/shared');
const {
  affectedLibNames
} = require('@nrwl/workspace/src/command-line/affected-apps');
const { readdir } = require('fs-extra');

const pexec = cmd =>
  new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        rej(stderr);
      } else {
        res(stdout);
      }
    });
  });

const allFilesInDir = dirName => {
  var res = [];
  fs.readdirSync(dirName).forEach(function(c) {
    var child = path.join(dirName, c);
    try {
      if (!fs.statSync(child).isDirectory()) {
        res.push(child);
      } else if (fs.statSync(child).isDirectory()) {
        res = res.concat(allFilesInDir(child));
      }
    } catch (e) {}
  });
  return res;
};

const getAffectedLibs = () => {
  const p = parseFiles({ _: process.argv.slice(3) });
  const touchedFiles = p.files;

  console.log(touchedFiles);
  const config = JSON.parse(fs.readFileSync('./workspace.json', 'utf-8'));
  const nxEnv = JSON.parse(fs.readFileSync('./nx.json', 'utf-8'));

  let projects = [];
  if (config.projects)
    for (var i in config.projects) projects.push([i, config.projects[i]]);

  projects = (config.projects ? projects : []).map(function(p) {
    let files = allFilesInDir(path.dirname(p[1].sourceRoot));

    touchedFiles
      .map(function(p) {
        return files.includes(p);
      })
      .filter(function(k) {
        if (k === true) touchedFiles.push(p[0]);
      });

    return {
      name: p[0],
      type: p[1].projectType.substring(0, 3),
      files: files
    };
  });

  let deps = [];
  let depsPerProject = [];
  if (nxEnv.projects)
    for (var i in nxEnv.projects) {
      depsPerProject = [];
      if (nxEnv.projects[i].implicitDependencies) {
        for (var j in nxEnv.projects[i].implicitDependencies)
          depsPerProject.push({
            projectName: nxEnv.projects[i].implicitDependencies[j]
          });
      }
      deps[i] = depsPerProject || [];
    }

  return affectedLibNames(projects, deps, touchedFiles);
};

module.exports = {
  getAffectedLibs,
  pexec
};
