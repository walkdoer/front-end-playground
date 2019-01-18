const _ = require('koa-route');
const Koa = require('koa');
const app = new Koa();

function generateStudents(size) {
  const arr = [];
  let i = 0;
  while(i < size) {
    arr.push({ id: i, name: `stu name${i}` });
    i++;
  }
  return arr;
}
const students = generateStudents(10);

const api = {
  students: (ctx) => {
    ctx.body = students;
  },

  courses: (ctx) => {
    const { stuId } = ctx.request.query;
    ctx.body = [{ stuId, name: 'history' }, { stuId, name: 'math' }];
  },

  evaluation: (ctx, course) => {
    ctx.body = {
      id: Math.round(Math.random() * 100),
      course,
      score: Math.round(Math.random() * 100),
    }
  }
};

app.use(_.get('/api/students', api.students));
app.use(_.get('/api/courses', api.courses));
app.use(_.get('/api/evaluation/:course', api.evaluation));

app.listen(4444);
console.log('listening on port 4444');