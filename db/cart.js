const client= require('./client');

async function getAllCarts() {
  const { rows } = await client.query(
    `SELECT *
    FROM cart;
  `);

  return rows;
}


async function createCart({ 
    usersId, 
    itemsId,
    processed,
    inProcess,
    quantity
    
  }) {
    try {
      const { rows: [ cart ] } = await client.query(`
        INSERT INTO cart("usersId", "itemsId", quantity) 
        VALUES($1, $2, $3)
        RETURNING *;
      `, [usersId, itemsId, quantity]);
  
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async function getCartById(id) {
    try {
      const { rows: [ cart ] } = await client.query(`
        SELECT *
        FROM cart
        WHERE id=${ id }
      `);
      //console.log("GET ROUTINE BY ID" ,cart); 
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async function getCartByUsersId(usersId) {
    try {
      const {rows} = await client.query(`
        SELECT *
        FROM cart
        WHERE "usersId"=${ usersId }
      `);
    
  
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  
  
  async function deleteCart (id) {
    try {
        
      await client.query(`
        DELETE 
        FROM cart
        WHERE id=${id}
        RETURNING *;
      `);
    
  
     
    } catch (error) {
      throw error;
    }
  }

  async function removeItem (itemsId) {
    try {
        
       await client.query(`
        DELETE 
        FROM cart
        WHERE "itemsId"=${itemsId}
      `);
    
    
     
    } catch (error) {
      throw error;
    }
  }
  async function getCartAndItemsByUserId(usersId) {
    try {
      
  
      const {rows} = await client.query(`
        SELECT * FROM items
        JOIN cart ON "itemsId" = items.id
        WHERE "usersId" = ${usersId};
      `);
      console.log("ITEMS", rows);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  async function getCartAndItemsInPrcoessByUserId(usersId) {
    try {
      
  
      const {rows} = await client.query(`
        SELECT * FROM items
        JOIN cart ON "itemsId" = items.id
        WHERE "usersId" = ${usersId} AND "inProcess" = true;
      `);
      console.log("ITEMS", rows);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  async function cartcheckout({ 
    usersId,
    processed, 
    inProcess,
    
    
  }) {
    try {

    const {rows} = await client.query(`
    UPDATE cart
    SET "inProcess"=$1, processed=$2 
    WHERE "usersId"=${usersId}
    RETURNING *;
`, [inProcess, processed]);
return rows;

  
    } catch (error) {
      throw error;
    }
  }

  async function editCart({ 
    itemsId,
    quantity
    
  }) {
    try {
    // added this just so i know this is updated in git 
const {rows: [updatedQuantity]} = await client.query(`
UPDATE cart
SET quantity=$1
WHERE "itemsId"=${itemsId}
RETURNING *;
`, [quantity]);
return updatedQuantity;
    
    } catch (error) {
      throw error;
    }
  }
  module.exports = {
    getCartById,
    createCart,
    removeItem,
    deleteCart,
    getCartByUsersId,
    getAllCarts,
    getCartAndItemsByUserId,
    getCartAndItemsInPrcoessByUserId,
    editCart,
    cartcheckout
}