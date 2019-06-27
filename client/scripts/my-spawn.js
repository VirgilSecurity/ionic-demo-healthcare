const path = require('path');
require('dotenv').config({ path: path.resolve('..', '.env') });
const { spawn } = require('child_process');

const SEPARATOR = process.platform === 'win32' ? ';' : ':';
const env = Object.assign({}, process.env);

env.PATH = path.resolve('./node_modules/.bin') + SEPARATOR + env.PATH;

module.exports = function(cmd) {
    return spawn(cmd, {
        cwd: process.cwd(),
        env: env,
        stdio: 'inherit',
        shell: true
    });
}
