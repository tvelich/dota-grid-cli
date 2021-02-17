#!/usr/bin/env node
import runProgram from './program';

async function main() {
  try {
    await runProgram();
  } catch (err) {
    console.error(err);
  }
}

main();
