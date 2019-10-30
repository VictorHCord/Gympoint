import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import Student from '../app/models/Student';
import User from '../app/models/User';
import Plans from '../app/models/Plans';
import File from '../app/models/File';
import Enrollments from '../app/models/Enrollments';
import Checkins from '../app/models/Checkins';

import databaseConfig from '../config/database';

const models = [Student, User, Plans, File, Enrollments, Checkins];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gympoint',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
