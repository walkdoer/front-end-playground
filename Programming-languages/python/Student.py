class Student(object):

    def __init__(self, name, score):
        self.__name = name
        self.__score = score

    def print_score(self):
        print ' %s: %s' % (self.name, self.score)

    def get_name(self):
        return self.__name

    def get_score(self):
        return self.__score

    def set_score(self, score):
        self.__score = score

    def set_name(self, name):
        self.__name = name


if __name__=='__main__':
    stu1 = Student('andrew', 100)
    stu1.print_score();