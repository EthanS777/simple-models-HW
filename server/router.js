// import the controllers
// This only specifies the folder name, which means it will automatically pull the index.js file
const controllers = require('./controllers');

// function to attach routes
const router = (app) => {
  // pass the express app in

  // GET/POST
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);
  app.get('/getName', controllers.getName);
  app.get('/findByName', controllers.searchName);
  app.get('/', controllers.index);

  // catch for any other GET request. The * means anything
  app.get('/*', controllers.notFound);

  // When someone POSTS to /setName, call controllers.setName
  app.post('/setName', controllers.setName);

  // When someone POSTS to /updateLast, call controllers.updateLast
  app.post('/updateLast', controllers.updateLast);

  // NEW FOR DOGS:
  app.post('/setDog', controllers.setDog);
  app.post('/updateDog', controllers.updateDog);
};

// export the router function
module.exports = router;
