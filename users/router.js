const express = require("express");

const knex = require("knex");
const router = express.Router();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const knexConfig = require("../knexfile.js");

const db = knex(knexConfig.development);

const sessionConfig = {
  secret: "ireallylovebaseball",
  name: "maninthemoon",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  },
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};
router.use(session(sessionConfig));



// The C in CRUD

router.post("/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = user.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json({message: "Server Error. User could not be registered"});
    });
});

// Still C. Think of logging in as creating an event


router.post("/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: `Welcome ${username}` });
      } else {
        res.status(401).json({ message: `And the sign said, you got to have a membership card to get inside. Ugg! `});
      }
    });
});

// The R in CRUD  

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("Unable to log this user out");
      } else {
        res.status(200).json({ message: `Goodbye ${username}. Please visit us again soon` });
      }
    });
  }
});

// And what can we do as legal users. Hah! Nothing, but get a list of users. Still R in CRUD

router.get("/users", protected, (req, res) => {
 
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send({message: "Server error. Unable to read users"}));
});


function protected(req, res, next) {
    if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({
      message: "Authorized users only"
    });
  }
}



module.exports = router;