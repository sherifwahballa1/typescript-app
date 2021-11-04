import MongoManager from '../../core/connections/mongo/mongoManger';

export const mongoConnection = () => {
  MongoManager.client;
};

export const closeMongoConnection = () => {
  MongoManager.closeConnection();
};