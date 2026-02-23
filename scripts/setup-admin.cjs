#!/usr/bin/env node
/**
 * setup-admin.js — Set the admin password (stored as bcrypt hash)
 * Writes to admin.config.json (gitignored)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const bcrypt = require('bcryptjs');

const ROOT = path.join(__dirname, '..');
const ADMIN_CONFIG = path.join(ROOT, 'admin.config.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mute input for password
function getPassword(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    let password = '';
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function onData(char) {
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        process.stdout.write('\n');
        stdin.removeListener('data', onData);
        resolve(password);
      } else if (char === '\u0003') {
        process.exit();
      } else if (char === '\u007f' || char === '\b') {
        password = password.slice(0, -1);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(prompt + '*'.repeat(password.length));
      } else {
        password += char;
        process.stdout.write('*');
      }
    });
  });
}

async function main() {
  console.log('\n🔐 jsFun Admin Password Setup\n');

  if (fs.existsSync(ADMIN_CONFIG)) {
    const ans = await new Promise((resolve) => {
      rl.question('Admin config already exists. Overwrite? (y/N): ', resolve);
    });
    if (ans.toLowerCase() !== 'y') {
      console.log('Aborted.');
      rl.close();
      return;
    }
  }

  rl.close();

  const pw1 = await getPassword('New admin password: ');
  const pw2 = await getPassword('Confirm password: ');

  if (pw1 !== pw2) {
    console.error('Passwords do not match. Please run again.');
    process.exit(1);
  }

  if (pw1.length < 6) {
    console.error('Password must be at least 6 characters.');
    process.exit(1);
  }

  const hash = bcrypt.hashSync(pw1, 12);
  fs.writeFileSync(ADMIN_CONFIG, JSON.stringify({ passwordHash: hash }, null, 2));
  console.log('\n✓ Admin password set. Access the admin panel at /admin\n');
}

main().catch(console.error);
