const fetch = require('node-fetch');
const co = require('co');
const host = 'http://127.0.0.1:4444';
const getStudents = (classroom) => fetch(`${host}/api/students?classroom=${classroom}`).then(res => res.json());
const getCourses = (stuId) => fetch(`${host}/api/courses?stuId=${stuId}`).then(res => res.json());
const getEvaluation = (stuId, course) => fetch(`${host}/api/evaluation/${course}?stuId=${stuId}`).then(res => res.json());
const average = (courses) => courses.reduce((sum, course) => sum + course.score, 0) / courses.length;

// Promise Version
const countAveragePromiseVersion = (classroom) => {
  // get students of given classroom
  getStudents(classroom)
  .then((students) => {
    // calculate one by one
    return students.reduce((promise, student) => {
      return promise
        .then(() => getCourses(student.id))
        .then(courses => Promise.all(courses.map(course => getEvaluation(course.stuId, course.name))))
        .then(evalations => {
          console.log({ id: student.id, name: student.name, score: evalations, average: average(evalations) });
        })
    }, Promise.resolve());
  });
}

// Async Await Version
const countAverage = async function(classroom) {
  // get students of given classroom
  const students = await getStudents(classroom);
  for (let index = 0; index < students.length; index++) {
    const student = students[index];
    // get student's courses
    const courses = await getCourses(student.id);
    const evaluations = [];
    // get evaluation of each courses
    for (let j = 0; j < courses.length; j++) {
      const course = courses[j];
      evaluations.push(await getEvaluation(student.id, courses.id));
    }
    console.log({ id: student.id, name: student.name, average: average(evaluations)});
  }
}


const observableVersion = (classroom) => {
  const students = frp.fromPromise(getStudents(classroom));
  const courses = students.map(student => frp.fromPromise(getCourses(student.id)));
  const evaluations = courses.map(course => frp.fromPromise(getEvaluation(stu)))
}

function generatorVersion(classroom) {
  // use co.js to simplify the process
  co(function *() {
    const students = yield getStudents(classroom);
    for (let index = 0; index < students.length; index++) {
      const student = students[index];
      // get student's courses
      const courses = yield getCourses(student.id);
      const evaluations = [];
      // get evaluation of each courses
      for (let j = 0; j < courses.length; j++) {
        const course = courses[j];
        evaluations.push(yield getEvaluation(student.id, courses.id));
      }
      console.log({ id: student.id, name: student.name, average: average(evaluations)});
    }
  });
}

// countAverage();
generatorVersion();




