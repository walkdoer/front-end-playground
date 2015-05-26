
/**
 * 读了 http://joshbassett.info/2014/take-your-code-to-the-next-level-with-fkit/ 这篇博文之后，好奇其curry是如何是实现的
 */

function curry(f) {
  var arity = f.length;

  return (arity <= 1) ? f : given([], 0);

  function given(args, applications) {
    return function() {
      var newArgs = args.concat(
        (arguments.length > 0) ? Array.prototype.slice.call(arguments, 0) : undefined
      );

      return (newArgs.length >= arity) ?
        f.apply(this, newArgs) :
        given(newArgs, applications + 1);
    };
  }
}



var add3 = curry(function(a, b, c) { return a + b + c; });

add3(1)(2)(3);