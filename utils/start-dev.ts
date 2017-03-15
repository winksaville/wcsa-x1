import * as child from 'child_process';

//const debug = require('debug')('start-dev');

let children: child.ChildProcess[] = [];

function debug(str: string) {
  console.log(str);
}

process.on('SIGINT', () => {
  debug('\nCaught SIGINT signal');
  process.exit(1);
});

function startServer() {
  let index = children.length;
  children.push(child.spawn('./node_modules/.bin/nodemon', [
                              '--watch ./dist',
                              './dist/server/server.js'
                            ], {
                              env: { DEBUG: 'server' },
                              shell: true
                            }));
  children[index].stdout.on('data', (data) => {
    process.stdout.write(`${index} out server: ${data}`);
  });
  children[index].stderr.on('data', (data) => {
    process.stdout.write(`${index} err server: ${data}`);
  });
}

function startTsc(tsconfig: string, debug: string) {
  let index = children.length;
  children.push(child.spawn('./node_modules/.bin/tsc',
                            [ '-w', '-p', tsconfig ],
                            {
                              env: { DEBUG: debug },
                              shell: true
                            }));
  children[index].stdout.on('data', (data) => {
    process.stdout.write(`${index} out ${tsconfig}: ${data}`);
  });
  children[index].stderr.on('data', (data) => {
    process.stdout.write(`${index} err ${tsconfig}: ${data}`);
  });
}

function startWebPack() {
  let index = children.length;
  children.push(child.spawn('./node_modules/.bin/webpack', [
      '-w',
      'dist/client/client.js',
      'dist/client/bundle.js'
    ], {
      env: { DEBUG: debug },
      shell: true
    }));
  children[index].stdout.on('data', (data) => {
    process.stdout.write(`${index} out webpack: ${data}`);
  });
  children[index].stderr.on('data', (data) => {
    process.stdout.write(`${index} err webpack: ${data}`);
  });
}



startServer();
startTsc('./src/common/tsconfig.json', 'common,nop');
startTsc('./src/server/tsconfig.json', 'server');
startTsc('./src/client/tsconfig.json', 'client');
startWebPack();

debug('Hit control-c to stop');
process.stdin.resume();
