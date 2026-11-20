const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', '  🚀 Starting LearnMate AI Backend (8000) & Frontend (5173)');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');

const pythonCmd = isWin ? 'python' : 'python3';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Start FastAPI backend
const backend = spawn(pythonCmd, ['-m', 'uvicorn', 'app.main:app', '--app-dir', 'backend', '--host', '127.0.0.1', '--port', '8000', '--reload'], {
  cwd: rootDir,
  shell: true,
  stdio: 'inherit',
});

// 2. Start Vite frontend
const frontend = spawn(npmCmd, ['--prefix', 'frontend', 'run', 'dev'], {
  cwd: rootDir,
  shell: true,
  stdio: 'inherit',
});

function cleanup() {
  console.log('\nShutting down LearnMate AI servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
