var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users');

// GET all users
router.get('/', async function (req, res, next) {
  try {
    let data = await userSchema.find({ isDeleted: false });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET user by ID
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne({ _id: req.params.id, isDeleted: false });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

// POST new user
router.post('/', async function (req, res, next) {
  try {
    let newObj = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    });
    await newObj.save();
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// PUT update user
router.put('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: "USER NOT FOUND" });
  }
});

// DELETE user (soft delete)
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: "USER NOT FOUND" });
  }
});

// POST /enable
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND OR ALREADY DELETED" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// POST /disable
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND OR ALREADY DELETED" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
