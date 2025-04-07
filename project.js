const http = require("http");

const PORT = 3030;
let students = [];

//Function to Create a random id for each student
function generateId() {
  return Date.now().toString();
}

const server = http.createServer((req, res) => {
  // console.log(req.url, req.method, req.headers);
  const method = req.method;
  const url = req.url || "";
  if (req.url == "/") {
    res.setHeader("Content-type", "text/plain");
    res.end("Welcome");
    return;
  }

  //Printing the students existing in the list

  //   if (method === "GET" && url === "/students") {
  //     res.setHeader("Content-Type", "application/json");
  //     res.statusCode = 200;
  //     res.end(JSON.stringify(students));
  //     return;
  //   }
  if (method === "GET" && url === "/students") {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    const dataInHtml = students
      .map(
        (stdnt) =>
          `<h2>The Name is:  ${stdnt.name}   &   the Registration is: ${stdnt.registration}</h2>`
      )
      .join("");
    res.end(dataInHtml);
    return;
  }

  // Create a new Student

  if (method === "POST" && url === "/students") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const newStudent = JSON.parse(body);
      newStudent.id = generateId();
      students.push(newStudent);
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 201;
      res.end(JSON.stringify(newStudent));
    });
    return;
  }

  //Updating Student name & Registration
  if (method === "PUT" && url.startsWith("/students/")) {
    const studentId = url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const updatedStudent = JSON.parse(body);
      const index = items.findIndex((s) => s.id === studentId);
      if (index !== -1) {
        students[index] = { ...students[index], ...updatedStudent };
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(students[index]));
      } else {
        res.statusCode = 404;
        res.end("Item not found");
      }
    });
    return;
  }

  //Deleting Student
  if (method === "DELETE" && url.startsWith("/students/")) {
    const studentId = url.split("/")[2];
    const index = students.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      const deletedStudent = items.splice(index, 1)[0];
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify(deletedStudent));
    } else {
      res.statusCode = 404;
      res.end("Item not found");
    }
    return;
  }
  // for all other Invalid routes
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.end("Route not found");
});

server.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
