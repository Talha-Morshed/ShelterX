const { spawn } = require('node:child_process');

// Adnan - Start the API and Vite client together and stop both when either exits.
const scripts = ['server:dev', 'client'];
const isWindows = process.platform === 'win32';
let stopping = false;

const processes = scripts.map((script) => {
  const command = isWindows ? 'cmd.exe' : 'npm';
  const args = isWindows ? ['/d', '/s', '/c', `npm run ${script}`] : ['run', script];
  const child = spawn(command, args, {
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    if (!stopping && code !== 0) stopProcesses(code || 1);
  });

  return child;
});

const stopProcesses = (exitCode = 0) => {
  if (stopping) return;
  stopping = true;
  for (const child of processes) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = exitCode;
};

process.on('SIGINT', () => stopProcesses());
process.on('SIGTERM', () => stopProcesses());