#!/usr/bin/env python
# -*- coding: utf-8 -*-
## 进程间的通信


from multiprocessing import  Process, Queue
import os, time, random


# 写进程
def write(q):
    for value in ['a', 'b', 'c']:
        print 'put %s to queue...' % value
        q.put(value)
        time.sleep(random.random())


# 读进程

def read(q):
    while True:
        value = q.get(True)
        print 'Get %s from queue.' % value

if __name__ == '__main__':
    # 父进程创建Queue
    q = Queue()
    pw = Process(target=write, args=(q,))
    pr = Process(target=read, args=(q,))
    # 启动写子进程
    pw.start()
    # 启动读子进程
    pr.start()
    # 等待pw结束
    pw.join()
    # 由于read子进程是死循环，所以只能强制终止
    pr.terminate()