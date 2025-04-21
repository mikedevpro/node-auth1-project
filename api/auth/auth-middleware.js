/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.status(401).json({ message: 'You shall not pass!' })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  const { username } = req.body
  if (username) {
    findBy({ username })
      .then(users => {
        if (users.length) {
          res.status(422).json({ message: 'Username taken' })
        } else {
          next()
        }
      })
  } else {
    next()
  } 
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  const { username } = req.body
  if (username) {
    findBy({ username })
      .then(users => {
        if (users.length) {
          next()
        } else {
          res.status(401).json({ message: 'Invalid credentials' })
        }
      })
  } else {
    next()
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body
  if (password && password.length > 3) {
    next()
  } else {
    res.status(422).json({ message: 'Password must be longer than 3 chars' })
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}