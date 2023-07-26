class Data{

    students;
    courses;
    
  
    constructor( setStudents = "", setCourses= "") {
        this.courses = setCourses;
        this.students = setStudents;
    }
  
    setStudents(newStudents){this.students = newStudents}
  
    setCourses(newCourses){this.age = newCourses}
  
    getStudents(){return this.students;}
  
    getCourses(){return this.courses;}
  
}

dataCollection = null;
const fs = require('fs');

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }
      
      fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }

        try {
          var studentsData = JSON.parse(studentDataFromFile);
          var coursesData = JSON.parse(courseDataFromFile);
          dataCollection = new Data(studentsData, coursesData);
          resolve(dataCollection);
        } catch (error) {
          reject("Error parsing JSON data");
        }
      });
    });
  });
}


function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (!dataCollection || !dataCollection.students) {
      reject("No student data available");
      return;
    }

    var studentCollection = dataCollection.students;
    if (studentCollection.length === 0) {
      reject("No results returned for student");
      return;
    }

    resolve(studentCollection);
  });
}


function getTAs() {
  return new Promise((resolve, reject) => {
    var tas = dataCollection.students.filter(student => student.TA === true);
    if (tas.length === 0) {
      reject("No results returned for TAs true");
    } else {
      resolve(tas);
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (!dataCollection || !dataCollection.courses) {
      reject("No course data available");
      return;
    }

    var coursesCollection = dataCollection.courses;
    if (coursesCollection.length === 0) {
      reject("No results returned for courses");
      return;
    }

    resolve(coursesCollection);
  });
}

/**
 * Function getStudentsByCourse
 * @param {
 * } course 
 * @returns 
 */
function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    var filteredStudents = dataCollection.students.filter(studentByCrs => studentByCrs.course == course);
    if (filteredStudents.length > 0) {
      resolve(filteredStudents);
    } else {
      reject("No results returned");
    }
  });
}

/**
 * Function getStudentByNum
 * 
 * @param {*} num 
 * @returns 
 */
function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    var foundStudent = dataCollection.students.filter((studentByNum) => studentByNum.studentNum == num);
    if (foundStudent.length > 0) {
      resolve(foundStudent);
    } else {
      reject("No results returned");
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (!studentData.TA) {
      studentData.TA = false;
    } else {
      studentData.TA = true;
    }

    studentData.studentNum = dataCollection.students.length + 1;
    dataCollection.students.push(studentData);

    resolve();
  });
}

module.exports = {
  initialize,
  getAllStudents,
  getCourses,
  getTAs,
  getStudentsByCourse,
  getStudentByNum,
  addStudent
};
