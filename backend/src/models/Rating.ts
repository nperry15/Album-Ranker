import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import Album from './Album';
import Track from './Track';

class Rating extends Model { }

Rating.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        albumId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trackId: {
            type: DataTypes.STRING,
            allowNull: true, // optional if rating a track
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Rating',
    }
);

// Associations
Album.hasMany(Rating, { foreignKey: 'albumId' });
Rating.belongsTo(Album, { foreignKey: 'albumId' });

Track.hasMany(Rating, { foreignKey: 'trackId' });
Rating.belongsTo(Track, { foreignKey: 'trackId' });

export default Rating;