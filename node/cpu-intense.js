function fibo (n) {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}

(function fiboLoop () {
  process.stdout.write(fibo(45).toString());
  process.nextTick(fiboLoop);
})();

(function spinForever() {
  process.stdout.write(".");
  process.nextTick(spinForever);
})();
