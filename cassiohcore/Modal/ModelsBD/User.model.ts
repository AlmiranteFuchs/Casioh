import { Model, DataTypes } from 'sequelize'
import { Db } from "../../db.config";
import { access } from 'fs';

const db = new Db().connection;

export class User extends Model { }

User.init({
  user_id :{
    primaryKey: true,
    type: DataTypes.STRING,
  },

  username: DataTypes.STRING,
  phone: DataTypes.STRING,
  access_level: DataTypes.SMALLINT
  }, {
    sequelize : db,
    modelName: 'User',
    tableName: 'User',
    timestamps: false,
    freezeTableName: true
   }
);
