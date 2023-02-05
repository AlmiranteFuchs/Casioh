import { Model, DataTypes } from 'sequelize'
import { Db } from "../../db.config";
import { User } from './User.model';
import { Hooks } from 'sequelize/types/hooks';

const db = new Db().connection;

export class Copypasta extends Model { }

Copypasta.init({
  name :{
    primaryKey: true,
    type: DataTypes.TEXT,
  },

  text: DataTypes.TEXT,
  user_id: {
    type: DataTypes.STRING,
    
    references: {
      model: User,
      key: 'user_id'
    }
  }

  }, { 
    sequelize : db,
    modelName: 'Copypasta',
    tableName: 'Copypasta',
    timestamps: false,
    freezeTableName: true
   }
);
