/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const path = require('path');

module.exports = function createRuntime(filename, config) {
  const NodeEnvironment = require('jest-environment-node');
  const Runtime = require('../');

  const normalizeConfig = require('jest-config').normalize;

  config = normalizeConfig(Object.assign({
    name: 'Runtime-' + filename.replace(/\W/, '-') + '-tests',
    rootDir: path.resolve(path.dirname(filename), 'test_root'),
  }, config));

  const environment = new NodeEnvironment(config);
  return Runtime.createHasteMap(config, {resetCache: false, maxWorkers: 1})
    .build()
    .then(moduleMap => {
      const runtime = new Runtime(
        config,
        environment,
        Runtime.createResolver(config, moduleMap),
      );

      runtime.__mockRootPath = path.join(config.rootDir, 'root.js');
      return runtime;
    });
};
