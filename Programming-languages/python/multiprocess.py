from multiprocessing import Process

import os

def run_proc(name):
    print 'run child process %s (%s)' % (name, os.getpid())

if __name__ == '__main__':
    print 'parent process is %s ' % os.getpid()
    p = Process(target = run_proc, args = ('test',))
    print 'process will start'
    p.start()
    p.join()
    print 'process end'