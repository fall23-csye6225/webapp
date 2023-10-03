const base64 = require('base-64');
const bcrypt = require('bcrypt');
//const { Users } = require('../models'); // Assuming you have a Sequelize model named 'User'
const db = require('../models/index');

const checkAuthorization = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(db.users);
  const Users = db.users;

  if (authHeader) {
    try {
      const credentials = base64.decode(authHeader.split(' ')[1]);
      const [email, password] = credentials.split(':');

      const user = await Users.findOne({ where: { email } });


      if (user && await bcrypt.compare(password, user.password)) {
        req.user = user;
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    } catch (error) {
      console.error('Error fetching user from the database:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
};

module.exports = checkAuthorization;
