// knexfile.js

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './pets.db',
    },
    useNullAsDefault: true,
  },
};
