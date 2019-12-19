
exports.up = function(knex) {
  return knex.schema.createTable('users', user=> {
      user.increments();
      user.string('username', 128).notNullable().unique();
      user.string('email', 280).notNullable().unique();
      user.string('password').notNullable();
  })
  .createTable('jokes', joke=> {
    joke.increments();
    joke.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    joke.string('question', 300)
    joke.string('answer', 300).notNullable();
    joke.string('status').notNullable();
  })
  .createTable('saved', saves => {
      saves.integer('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      saves.integer('posted_user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      saves.integer('joke_id').unsigned().notNullable().unique().references('id').inTable('jokes').onDelete('CASCADE').onUpdate('CASCADE');
  })
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('saved').dropTableIfExists('jokes').dropTableIfExists('saved')
};
