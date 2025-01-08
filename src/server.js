const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesValidator = require('./validator/notes');

const NotesService = require('./services/inMemory/NotesService');
const init = async () => {
  const notesService =  new NotesService();


  const server = Hapi.server({
    port: 3000,
    // eslint-disable-next-line no-undef
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();