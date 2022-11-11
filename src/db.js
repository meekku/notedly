// Require the mongose library
const mongoose = require('mongoose');

module.exports = {
  connect: DB_HOST => {
    // Yhdistä tietokantaan
    mongoose.connect(DB_HOST);
    // Kirjoita epäonnistumisesta virheilmoitus lokiin
    mongoose.connection.on('error', err => {
      console.error(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running.'
      );
      process.exit();
    });
  },

  close: () => {
    mongoose.connection.close();
  }
};