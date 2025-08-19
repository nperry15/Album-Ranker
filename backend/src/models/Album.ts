import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';

class Album extends Model {
    declare id: string;
    declare title: string;
    declare artist: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Album.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,

        }
    },
    {
        sequelize,
        modelName: 'Album',
        tableName: 'albums',
    }
);

export default Album;