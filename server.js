/********************************************************************************* *
 * WEB700 – Assignment 05 
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


// Add the middleware function
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
});


//Define the custom helpers, including the new "equal" helper
const customHelpers = {
  navLink: function(url, options){
    return '<li' +
    ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
    '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
  },

  // Define the "equal" helper
  equal: function (lvalue, rvalue, options) {
    if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  }
};

var handlebars = require("express-handlebars").create({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: customHelpers
});

// Configure the "express-handlebars" view engine and register the custom helpers
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

// Set the public directory as a source for static files
app.use(express.static(path.join(__dirname)));

// for POST request
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

/**********************Routes to return data ***************/
// GET /students route
app.get('/students', (req, res) => {
  const course = req.query.course;
  if (course) {
    // If 'course' query parameter is provided
    collegeData.getStudentsByCourse(course)
      .then((students) => {
        if (students.length > 0) {
          res.render("students", { students: students });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("students", { message: "no results" });
      });
  } else {
    // If 'course' query parameter is not provided
    collegeData.getAllStudents()
      .then((students) => {
        if (students.length > 0) {
          res.render("students", { students: students });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("students", { message: "no results" });
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
        res.render("courses", { courses: courses });
      } else {
        res.render("courses", { message: "no results" });
      }
    })
    .catch((error) => {
      res.render("courses", { message: "no results" });
    });
});

 // GET /courses/id route
app.get('/course/:id', (req, res) => {
  const courseId = parseInt(req.params.id);

  collegeData.getCourseById(courseId)
    .then((course) => {
      res.render("course", { course: course });
    })
    .catch((error) => {
      res.render("course", { message: "Course not found" });
    });
});

// GET /student/:num route
app.get('/student/:num', (req, res) => {
  const num = parseInt(req.params.num);

  collegeData.getStudentByNum(num)
    .then((data) => {
      console.log(data);
      res.render("student", { student: data })
    })
    .catch((error) => {
      res.render("student", { message: "No results" });
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

app.post("/student/update", (req, res) => {
  collegeData.updateStudent(req.body)
    .then(() => {
      res.redirect("/students"); // Redirect to the list of students page after updating the data
    })
    .catch((error) => {
      console.error("Error updating student:", error);
      res.redirect("/students"); // Redirect to the list of students page even if an error occurs
    });
});

// Set the views directory
//app.set('views', path.join(__dirname, 'views'));


/*****************ROUTES for html pages ***************************/
// GET / route
app.get("/", (req, res) => {
  res.render("home"); // Rendering the "home" view
});

// GET /about route
app.get('/about', (req, res) => {
    res.render("about");
  });
  
// GET /htmlDemo route
app.get('/htmlDemo', (req, res) => {
  res.render("htmlDemo");
});
  
// GET /students/add route
app.get('/students/add', (req, res) => {
  res.render("addStudent");
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
  