const {
  client,
  getAllUsers,
  createUser
} = require('./index');

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS cart;
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS users;

    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}



async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      active BOOLEAN DEFAULT false,
      admin BOOLEAN DEFAULT false,
      "firstName" varchar(255) NOT NULL, 
      "lastName" varchar(255) NOT NULL,
      location varchar(255) NOT NULL
    );
  `);

  await client.query(`
  CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name varchar(255) UNIQUE NOT NULL,
    price INTEGER NOT NULL, 
    description varchar(255) NOT NULL
  );
`);
// items table needs usersid and cartid
    await client.query(`
    CREATE TABLE cart (
      id SERIAL PRIMARY KEY,
      "usersId" INTEGER REFERENCES users(id),
      "itemsId" INTEGER REFERENCES items(id),
      processed BOOLEAN DEFAULT false, 
      "inProcess" BOOLEAN DEFAULT true 
    );
  `);



 
//ask shannon about image in database




    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({ username: 'albert', password: 'bertie99', firstName: 'Albert', lastName: 'Johnson', location: 'St. Louis' });
    // const sandra = await createUser({ username: 'sandra', password: '2sandy4me' });
    // const glamgal = await createUser({ username: 'glambal', password: 'soglam' });



    console.log("Finished creating users!");
  } catch(error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers()
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

