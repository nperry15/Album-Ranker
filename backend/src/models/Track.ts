import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import Album from './Album';

class Track extends Model { }

Track.init(
    {
        id: {
            type: DataTypes.STRING,  // <-- change from INTEGER to STRING
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        durationMs: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        albumId: {
            type: DataTypes.STRING,
            references: {
                model: Album,
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Track',
    }
);

export default Track;
