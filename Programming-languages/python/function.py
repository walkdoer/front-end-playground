def lazy_sum(* args):
    def sum():
        ax = 0
        for n in args:
            ax += n
        return ax
    return sum

def count():
    fs = []
    for i in range(1, 4):
        def f():
            return i * i
        fs.append(f);
    return fs

def count2():
    fs = []
    for i in range(1, 4):
        def f(j):
            def g():
                return j*j
            return g
        fs.append(f(i))
    return fs



def log(text):
    isFunction = hasattr(text, '__call__')
    print isFunction
    if (isFunction):
        def wrapper(*args, **kw):
            print 'call %s():' % text.__name__
            return text(*args, **kw)
        return wrapper
    else:
        def decorator(func):
            def wrapper(*args, **kw):
                print '%s %s():' % (text, func.__name__)
                return func(*args, **kw)
            return wrapper
        return decorator


@log('execute')
def now2():
    print '2013-12-25'

@log
def now():
    print '2013-12-25'

import functools

def func(a, b, c=0, *args, **kw):
    print 'a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw

func2 = functools.partial(func, **{'base': 2})
func2(1,2) #a = 1 b = 2 c = 0 args = () kw = {'base': 2}
func2(1, 2, 3, 4, 5) # a = 1 b = 2 c = 3 args = (4, 5) kw = {'base': 2}

func3 = functools.partial(func, 1, 2)
func3(3) # a = 1 b = 2 c = 5 args = () kw = {'base': 2}

func4 = functools.partial(func, 1, 2, **{'base': 2})
func4(5) # a = 1 b = 2 c = 5 args = () kw = {'base': 2}
