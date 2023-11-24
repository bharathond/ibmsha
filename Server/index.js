const express = require("express");
const user = require("./Models/user");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fileUpload = require("express-fileupload");
const path = require("path");
const helpers = require("./Models/helpers");

const post = require("./Models/post");

const app = express();
dotenv.config();

var jwtSecretKey = process.env.JWT_SECRET_KEY;

let PORT = process.env.PORT || 3001;
console.log(process.env.HOST);
app.listen(PORT, () => {
  console.log(`Server Listening: ${PORT}`);
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(cors());

/**
 * access uploaded file and external file from react
 */
app.use("/external", express.static(path.join(__dirname, "public")));

/**
 * User Module Request Block
 */

const userData = new user(); // calling User Model to access user data
const postData = new post(); // calling Post Model to access post data

var sql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodeapp",
});

sql.connect(function (err) {
  if (err) {
    console.log("error");
  } else {
    console.log("connected");
  }
});

app.post("/api/auth/requestToken", async (req, res) => {
  var userName = req.body.username;
  var data = {
    time: Date(),
  };

  userData.getUserByLogin(req, async (response) => {
    if (response.error !== "yes") {
      data.userId = response.data.id;
      data.userName = response.data.usr_username;
      data.firstName = response.data.usr_fname;
      data.lastName = response.data.usr_lname;
      data.email = response.data.usr_email;
      data.phone = response.data.usr_phone;
      data.role = response.data.user_role;

      const token = jwt.sign(data, jwtSecretKey, { expiresIn: "1 day" });
      res.json({ token: token, data: data });
    } else {
      //res.status(403);
      res.json({
        status: "Success",
        error: "yes",
        message: response.message,
        data: response.data,
      });
    }
  });
});

app.post("/api/auth/verifyUser", verifyToken, async (req, res) => {
  jwt.verify(req.token, jwtSecretKey, (err, authData) => {
    if (err) {
      //res.status(403);
      res.json({ status: "Success", error: "yes", message: "Invalid User!!!" });
    } else {
      res.json({ status: "Success", error: "no", message: "Valid User!!!" });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeaderToken = req.headers["x-access-token"];
  if (typeof bearerHeaderToken !== "undefined") {
    req.token = bearerHeaderToken;
    next();
  } else {
    res.status(403);
    res.json({
      status: "Success",
      error: "yes",
      message: "Authorization Request is failed!!!",
    });
  }
}

app.get("/api/cors", (req, res) => {
  res.json({ msg: "This has CORS enabled 🎈" });
});

app.post("/api/user/getAllUsers", (req, res) => {
  userData.getAllUser((response) => {
    res.json(response);
  });
});

app.post("/api/user/getUser", (req, res) => {
  var id = req.body.user.id;
  userData.getUserById(id, (response) => {
    res.json(response);
  });
});

app.post("/api/user/getUserByIndex/:index", (req, res) => {
  var index = req.params.index;
  var _value = req.body._value;
  var _cond = req.body._cond; // like or equal in where condition
  userData.getUserByIndex(index, _value, _cond, (response) => {
    res.json(response);
  });
});

app.post("/api/user/getUserByPhone/:index", (req, res) => {
  var index = req.params.index;
  var _value = req.body._value;
  var _cond = req.body._cond; // like or equal in where condition
  userData.getUserByPhone(index, _value, _cond, (response) => {
    res.json(response);
  });
});

app.post("/api/user/createUser", (req, res) => {
  var postData = req.body.user;
  userData.createUser(postData, (response) => {
    res.json(response);
  });
});
app.put("/api/user/updateUser/:id", (req, res) => {
  var postData = req.body.user;
  var id = req.params.id;
  userData.updateUser(id, postData, (response) => {
    res.json(response);
  });
});

app.get("/api/user/getPasswordHash", async (req, res) => {
  var password = req.body.password;
  var hasPass = await bcrypt.hash(password, 12);
  res.send(hasPass);
});

/**
 * End User Module Request Blocks
 */

/**
 * Start Post Module Request Blocks
 */

app.get("/api/post/fetchAllPosts", (req, res) => {
  postData.fetchAllPost((response) => {
    res.json(response);
  });
});

app.post("/api/post/fetchPost", (req, res) => {
  var postId = req.body.postId;
  postData.fetchPostById(postId, (response) => {
    res.json(response);
  });
});

app.post("/api/post/fetchTagPost", (req, res) => {
  var postTag = req.body.post_tag;
  postData.fetchPostByTag(postTag, (response) => {
    res.json(response);
  });
});

app.use(
  fileUpload({
    useTempFile: true,
    safeFileName: true,
    preserveExtension: true,
    tempFileDir: `${__dirname}/public/files/temp`,
  })
);

app.post("/api/post/fetchFilterPost", (req, res) => {
  var filterValue = req.body.filterValue;
  postData.fetchFilterPost(filterValue, (response) => {
    res.json(response);
  });
});

app.post("/api/post/createPost", async (req, res) => {
  let uploadFile = req.files.file;
  const name = uploadFile.name;
  const ext = path.extname(name);
  const saveAs = `${Date.now()}${ext}`;
  var postReq = req.body;
  const newPostData = {
    post_id: postReq.post_id,
    post_title: postReq.post_title,
    post_tag: postReq.post_tag,
    post_content: postReq.post_content,
    post_image: saveAs,
    created_at: helpers.getDate(),
  };
  postData.createPost(newPostData, (response) => {
    if (response.status) {
      uploadFile.mv(`${__dirname}/public/files/${saveAs}`, (err) => {
        if (err) {
          res.json({ message: err.message });
        } else {
          res.json({ message: "Success" });
        }
      });
    }
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hellow from Server with IP: 3001" });
});

/*app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'../client/build','index.html'));
});*/
