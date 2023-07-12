/********************************************************************************* *
 * WEB700 – Assignment 04 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source 
 * (including 3rd party web sites) or distributed to other students. 
 * * Name: Rusiri Jayalath Student ID:134442227 Date:07/12/2023 * 
 * Online (Cyclic) Link: https://breakable-bull-shawl.cyclic.app * 
 * 
 * ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

var path = require('path');
var collegeData = require('./modules/collegedata.js');


// Set the public directory as a source for static files
app.use(express.static(path.join(__dirname)));

// for POST request
app.use(express.urlencoded({ extended: true }));


/**********************Routes to return data ***************/
// GET /students route
app.get('/students', (req, res) => {
  const course = req.query.course;
  if (course) {
    // If 'course' query parameter is provided
    collegeData.getStudentsByCourse(course)
      .then((students) => {
        if (students.length > 0) {
          res.json(students);
        } else {
          res.json({ message: "no results" });
        }
      })
      .catch((error) => {
        res.json({ message: "no results" });
      });
  } else {
    // If 'course' query parameter is not provided
    collegeData.getAllStudents()
      .then((students) => {
        if (students.length > 0) {
          res.json(students);
        } else {
          res.json({ message: "no results" });
        }
      })
      .catch((error) => {
        res.json({ message: "no results" });
      });
  }
});

// GET /tas route
app.get('/tas', (req, res) => {
    collegeData.getTAs()
      .then((tas) => {
        if (tas.length > 0) {
          res.json(tas);
        } else {
          res.json({ message: "no results" });
        }
      })
      .catch((error) => {
        res.json({ message: "no results" });
      });
  });


  // GET /courses route
app.get('/courses', (req, res) => {
    collegeData.getCourses()
      .then((courses) => {
        if (courses.length > 0) {
          res.json(courses);
        } else {
          res.json({ message: "no results" });
        }
      })
      .catch((error) => {
        res.json({ message: "no results" });
      });
  });

// GET /student/:num route
app.get('/student/:num', (req, res) => {
    const num = req.params.num;
  
    collegeData.getStudentByNum(num)
      .then((student) => {
        res.json(student);
      })
      .catch((error) => {
        res.json({ message: "no results" });
      });
  });

// Adding "Post" route "/students/add" 
app.post('/students/add', (req, res) => {
  collegeData.addStudent(req.body)
    .then(() => {
      res.redirect('/students');
    })
    .catch((error) => {
      console.error('Error adding student:', error);
      res.redirect('/students');
    });
});
  

// Set the views directory
app.set('views', path.join(__dirname, 'views'));


/*****************ROUTES for html pages ***************************/
// GET / route
app.get('/', (req, res) => {
  res.sendFile('home.html', { root: app.get('views') });
});

// GET /about route
app.get('/about', (req, res) => {
    res.sendFile('about.html', { root: app.get('views') });
  });
  
// GET /htmlDemo route
app.get('/htmlDemo', (req, res) => {
  res.sendFile('htmlDemo.html', { root: app.get('views') });
});
  
// GET /students/add route
app.get('/students/add', (req, res) => {
  res.sendFile('addStudent.html', { root: app.get('views') });
});

// Fallback route for unmatched routes
app.use((req, res) => {
  res.status(404).send('404 Error: Page Not Found');
});

  
/***********************Initialize function **********************/
  // Initialize data
collegeData.initialize()
.then(() => {
  // Start the server
  app.listen(HTTP_PORT, () => {
    console.log('Server is running on port 8080: ' + HTTP_PORT);
  });
})
.catch((err) => {
  console.error('Error initializing data:', err);
});
  