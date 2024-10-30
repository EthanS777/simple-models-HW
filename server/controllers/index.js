// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Cat AND Dog models
const { Cat } = models;
const { Dog } = models;

// Function to handle rendering the index page.
const hostIndex = async (req, res) => {
  // Start with the name as unknown
  let name = 'unknown';

  try {
    const doc = await Cat.findOne({}, {}, {
      sort: { createdDate: 'descending' },
    }).lean().exec();

    // If we did get a cat back, store it's name in the name variable.
    if (doc) {
      name = doc.name;
    }
  } catch (err) {
    console.log(err);
  }

  /* res.render will render the given view from the views folder. In this case, index.
     We pass it a number of variables to populate the page.
  */
  res.render('index', {
    currentName: name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

// Function for rendering the page1 template
// Page1 has a loop that iterates over an array of cats
const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();

    return res.render('page1', {
      cats: docs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

// Function to render the untemplated page2.
const hostPage2 = (req, res) => {
  res.render('page2');
};

// Function to render the untemplated page3.
const hostPage3 = (req, res) => {
  res.render('page3');
};

// NEW: Host page 4
const hostPage4 = async (req, res) => {
  try {
    const docs = await Dog.find({}).lean().exec();

    return res.render('page4', {
      dogs: docs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

// Get name will return the name of the last added cat.
const getName = async (req, res) => {
  try {
    const doc = await Cat.findOne({}).sort({ createdDate: 'descending' }).lean().exec();

    // If we did get a cat back, store it's name in the name variable.
    if (doc) {
      return res.json({ name: doc.name });
    }
    return res.status(404).json({ error: 'No cat found' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong contacting the database' });
  }
};

// Function to create a new cat in the database
const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    // If they are missing data, send back an error.
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  try {
    await newCat.save();
    return res.status(201).json({
      name: newCat.name,
      beds: newCat.bedsOwned,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Cat with this name already exists',
      });
    }
    console.log(err);
    return res.status(500).json({ error: 'failed to create cat' });
  }
};

// NEW: Will create a dog
const setDog = async (req, res) => {
  //  console.log('Dog being set');
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({
      error: 'Name, breed, and age are all required',
    });
  }

  const dogData = {
    name: `${req.body.name}`,
    breed: `${req.body.breed}`,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  try {
    await newDog.save();
    return res.status(201).json({
      name: newDog.name,
      breed: newDog.breed,
      age: newDog.age,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Dog with this name already exists',
      });
    }
    console.log(err);
    return res.status(500).json({ error: 'Failed to create dog' });
  }
};

// NEW: Will look up dog by name, increase age by 1
const updateDog = async (req, res) => {
  //  console.log('Dog age being updated');
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    const dog = await Dog.findOneAndUpdate({ name }, { $inc: { age: 1 } }, {
      returnDocument: 'after',
    }).lean().exec();

    if (!dog) {
      return res.status(404).json({ error: 'No dog found!' });
    }

    return res.json({
      name: dog.name,
      age: dog.age,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Function to handle searching a cat by name.
const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    const doc = await Cat.findOne({ name: req.query.name }).exec();

    if (!doc) {
      return res.status(404).json({ error: 'No cat found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/* A function for updating the last cat added to the database.
   Usually database updates would be a more involved process, involving finding
   the right element in the database based on query, modifying it, and updating
   it. For this example we will just update the last one we added for simplicity.
*/
const updateLast = (req, res) => {
  const updatePromise = Cat.findOneAndUpdate(
    {},
    { $inc: { bedsOwned: 1 } },
    { // $inc: INCREASE (bedsOwned by 1)
      returnDocument: 'after', // Populates doc in the .then() with the version after update
      sort: { createdDate: 'descending' },
    },
  ).lean().exec();

  // If we successfully save/update them in the database, send back the cat's info.
  updatePromise.then((doc) => {
    if (!doc) {
      return res.status(400).json({ error: 'No cat to update' });
    }

    return res.json({
      name: doc.name,
      beds: doc.bedsOwned,
    });
  });

  // If something goes wrong saving to the database, log the error and send a message to the client.
  updatePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });
};

// A function to send back the 404 page.
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  setDog,
  updateDog,
  updateLast,
  searchName,
  notFound,
};
