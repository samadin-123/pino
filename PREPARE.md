# Evaluation Setup

This file is outside the editable surface. It defines how results are judged. Agents cannot modify the evaluator or the scoring logic — the evaluation is the trust boundary.

Consider defining more than one evaluation criterion. Optimizing for a single number makes it easy to overfit and silently break other things. A secondary metric or sanity check helps keep the process honest.

eval_cores: 1
eval_memory_gb: 1.0
prereq_command: npm install

## Setup

Install dependencies and prepare the evaluation environment:

```bash
npm install
```

The project uses CommonJS modules and does not require a build step. All source files are JavaScript and run directly on Node.js.

## Run command

```bash
node .polyresearch/benchmark.js
```

This runs the "basic" benchmark which measures the performance of logging a simple string message. The benchmark uses the fastbench library to measure time taken for 10 iterations of logging "hello world" to /dev/null, comparing Pino against other popular loggers (bunyan, winston, bole, debug, loglevel).

## Output format

The benchmark script outputs `METRIC=<number>` where the number represents operations per second (ops/sec) for Pino's basic logging operation. Higher values indicate better performance.

## Metric parsing

The CLI looks for `METRIC=<number>` in stdout. The benchmark script parses the average time in milliseconds from the runbench utility and converts it to ops/sec.

## Ground truth

The baseline metric represents Pino's logging throughput for simple string messages written to /dev/null. This is the core use case and the primary performance characteristic that makes Pino attractive as a "super fast" logger.

The benchmark isolates Pino's performance by:
- Using pino.destination('/dev/null') to eliminate I/O bottlenecks
- Logging simple strings to focus on the logger overhead
- Running 10,000 benchmark cycles with 10 iterations each for statistical stability
- Measuring only the time spent in pino.info() calls

Secondary validation:
- All tests must pass: `npm test` (includes linting, transpilation, unit tests, and type checking)
- No functional regressions in other benchmark scenarios (object logging, child loggers, etc.)
