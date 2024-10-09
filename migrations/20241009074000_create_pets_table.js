// migrations/YYYYMMDDHHMMSS_create_pets_table.js

exports.up = function (knex) {
    return knex.schema.createTable('pets', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('type').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('pets');
  };
  