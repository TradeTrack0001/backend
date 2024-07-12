// tests/routes.test.ts
import request from 'supertest';
import {app, server, prisma} from '../index'; // Adjust the path as necessary

afterAll(async () => {
  server.close();
  await prisma.$disconnect();
});


describe('Product API', () => {
  it('POST /add_product - should add a product', async () => {
    const productData = [{
      itemName: 'Test Product',
      itemSize: "medium",
      itemDescription: 'A product for testing',
      checkInDate: new Date().toISOString(),
      location: 'Test Location',
      itemStatus: true,
      itemQuantity: 10,
      itemID: 999,
      type: 'Test Type',
    }];

    const response = await request(app)
      .post('/api/add_product')
      .send(productData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product created');
  });

  it('GET /get_products - should get all products', async () => {
    const response = await request(app).get('/api/get_products');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product list');
  });

  it('GET /get_product/:id - should get a specific product', async () => {
    const response = await request(app).get('/api/get_product/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product found');
  });

  it('PUT /update_product/:id - should update a product', async () => {
    const updatedData = {
      itemName: 'Updated Test Product',
      checkInDate: new Date().toISOString(),
      checkOutDate: "",
      location: 'Updated Location',
      newQuantity: 20,
      type: 'Updated Type',
    };

    const response = await request(app)
      .put('/api/update_product/1')
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product updated');
  });

  // it('DELETE /delete_product/:id - should delete a product', async () => {
  //   const response = await request(app).delete('/api/delete_product/1');
  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe('Product deleted');
  // });

  // it('DELETE /delete_all - should delete all products', async () => {
  //   const response = await request(app).delete('/api/delete_all');
  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe('All products deleted');
  // });
});
