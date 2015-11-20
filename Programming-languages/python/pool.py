#!/usr/bin/env python
# -*- coding: utf-8 -*-
## 启动大量的子进程，可以用进程池的方式批量创建子进程

from multiprocessing import Pool
import time, os, random


def long_time_proc(name):
    print 'run task %s (%s)' % (name, os.getpid())
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print 'Task %s run %0.2f seconds' % (name, (end - start))


if __name__ == '__main__':
    print 'parent process %s' % os.getpid()
    p = Pool()
    for i in range(5):
        p.apply_async(long_time_proc, args=(i,))
    print 'waiting for all sub processes done'
    p.close()
    p.join()
    print 'all subprocess done'