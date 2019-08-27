module.exports = {
  name: 'mylib',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/mylib',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
