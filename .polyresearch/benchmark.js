#!/usr/bin/env node
'use strict'

const { spawn } = require('node:child_process')
const { resolve } = require('node:path')

// Run the basic benchmark which tests the core logging performance
const benchmarkPath = resolve(__dirname, '..', 'benchmarks', 'utils', 'runbench.js')

const proc = spawn(process.execPath, [benchmarkPath, 'basic', '-q'], {
  cwd: resolve(__dirname, '..')
})

let stdout = ''
let stderr = ''

proc.stdout.on('data', (data) => {
  stdout += data.toString()
})

proc.stderr.on('data', (data) => {
  stderr += data.toString()
})

proc.on('close', (code) => {
  if (code !== 0) {
    console.error('Benchmark failed with code', code)
    console.error(stderr)
    process.exit(1)
  }

  // Parse output to extract pino's average time in ms
  // Looking for lines like "pino average: 123.456ms"
  const lines = stdout.split('\n')
  let pinoAverage = null

  for (const line of lines) {
    const match = line.match(/Pino average:\s+([0-9.]+)ms/)
    if (match) {
      pinoAverage = parseFloat(match[1])
      break
    }
  }

  if (pinoAverage === null) {
    console.error('Could not parse pino average from benchmark output')
    console.error('Output:', stdout)
    process.exit(1)
  }

  // Convert time in ms to ops/sec (higher is better)
  // Each benchmark runs 10 iterations by default in basic.bench.js
  const iterations = 10
  const opsPerSec = (iterations / (pinoAverage / 1000)).toFixed(2)

  console.log(`METRIC=${opsPerSec}`)
})
