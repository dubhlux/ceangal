// Ceangal View diff benchmark runner
// Usage: node bench/run_bench.js

const fs = require('fs');
const { performance } = require('perf_hooks');
const B = (n) => BigInt(n);
const N = (b) => Number(b);

async function main() {
  const wasm = fs.readFileSync('bench/diff_wasm_bench.wasm');
  const { instance } = await WebAssembly.instantiate(wasm, {
    wasi_snapshot_preview1: new Proxy({}, { get: () => () => 0 }),
  });
  const ex = instance.exports;
  if (ex._start) try { ex._start(); } catch (_) {}

  function bench(name, setup, iterations = 1000) {
    setup();
    for (let i = 0; i < 10; i++) N(ex.run_diff());
    const start = performance.now();
    const total = N(ex.run_diff_n(B(iterations)));
    const elapsed = performance.now() - start;
    const perOp = elapsed / iterations;
    const s = perOp < 2 ? '✅' : perOp < 5 ? '🟡' : '❌';
    console.log(`${s} ${name}: ${perOp.toFixed(3)}ms/op (${iterations} iters, patches=${total/iterations})`);
  }

  function benchBuild(name, n, iterations = 100) {
    const start = performance.now();
    ex.run_build(B(n), B(iterations));
    const elapsed = performance.now() - start;
    const perOp = elapsed / iterations;
    const s = perOp < 3 ? '✅' : perOp < 10 ? '🟡' : '❌';
    console.log(`${s} build ${name}: ${perOp.toFixed(3)}ms/op`);
  }

  console.log('\n=== Ceangal View Diff Benchmark ===\n');

  bench('100 nodes, unchanged',      () => ex.setup_unchanged(B(100)));
  bench('100 nodes, 1 paint',        () => ex.setup_one_paint(B(100)));
  bench('500 nodes, unchanged',      () => ex.setup_unchanged(B(500)));
  bench('500 nodes, 1 paint',        () => ex.setup_one_paint(B(500)));
  bench('1000 nodes, unchanged',     () => ex.setup_unchanged(B(1000)));
  bench('1000 nodes, 1 paint',       () => ex.setup_one_paint(B(1000)));
  bench('5000 nodes, unchanged',     () => ex.setup_unchanged(B(5000)), 100);
  bench('5000 nodes, 1 paint',       () => ex.setup_one_paint(B(5000)), 100);

  console.log('\n--- Build Cost ---\n');
  benchBuild('100 nodes', 100, 1000);
  benchBuild('500 nodes', 500, 200);
  benchBuild('1000 nodes', 1000, 100);
  benchBuild('5000 nodes', 5000, 20);

  console.log('\nDone.');
}

main().catch(console.error);
