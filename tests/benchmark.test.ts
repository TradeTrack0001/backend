
import request from 'supertest';
import {app, server, prisma} from '../index'; // Adjust the path as necessary

describe('Performance Tests', () => {
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });
      
  afterAll(async () => {
    jest.restoreAllMocks()
    await prisma.$disconnect();
    server.close();
  });

  test('Load Test for User Authentication', async () => {
    const startTime = Date.now();
    const loginPromises = [];
    
    for (let i = 0; i < 100; i++) {
      loginPromises.push(
        request(app)
          .post('/api/login')
          .send({ email: 'testuser@example.com', password: 'password' })
      );
    }

    await Promise.all(loginPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(3000);
  });

  test('Stress Test for Adding Items to Inventory', async () => {
    const startTime = Date.now();
    const addPromises = [];
    
    for (let i = 0; i < 500; i++) {
      addPromises.push(
        request(app)
          .post('/api/add_product')
          .send({
            itemName: `Item ${i}`,
            itemSize: 'Medium',
            itemDescription: 'Test item',
            checkInDate: '2024-07-14',
            location: 'Warehouse 1',
            itemStatus: true,
            itemQuantity: 10,
            itemID: i,
            type: 'Test'
          })
      );
    }

    await Promise.all(addPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(7000);
  });

  test('Response Time Test for Inventory Search', async () => {
    const startTime = Date.now();
    const searchPromises = [];
    
    for (let i = 0; i < 100; i++) {
      searchPromises.push(
        request(app)
          .get('/api/get_products')
      );
    }

    await Promise.all(searchPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(2000);
  });

  test('Scalability Test for User Sessions', async () => {
    const startTime = Date.now();
    const sessionPromises = [];
    
    for (let i = 0; i < 1000; i++) {
      sessionPromises.push(
        request(app)
          .post('/api/login')
          .send({ email: 'testuser@example.com', password: 'password' })
      );
    }

    await Promise.all(sessionPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(15000);
  });

  test('Database Write Performance Test', async () => {
    const startTime = Date.now();
    const writePromises = [];
    
    for (let i = 0; i < 500; i++) {
      writePromises.push(
        request(app)
          .post('/api/add_product')
          .send({
            itemName: `Item ${i}`,
            itemSize: 'Medium',
            itemDescription: 'Test item',
            checkInDate: '2024-07-14',
            location: 'Warehouse 1',
            itemStatus: true,
            itemQuantity: 10,
            itemID: i,
            type: 'Test'
          })
      );
    }

    await Promise.all(writePromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(10000);
  });

  test('Database Read Performance Test', async () => {
    const startTime = Date.now();
    const readPromises = [];
    
    for (let i = 0; i < 500; i++) {
      readPromises.push(
        request(app)
          .get('/api/get_products')
      );
    }

    await Promise.all(readPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(5000);
  });

//   test('Concurrent User Performance Test', async () => {
//     const startTime = Date.now();
//     const concurrentPromises = [];
    
//     for (let i = 0; i < 100; i++) {
//       concurrentPromises.push(
//         request(app)
//           .post('/api/add_product')
//           .send({
//             itemName: `Item ${i}`,
//             itemSize: 'Medium',
//             itemDescription: 'Test item',
//             checkInDate: '2024-07-14',
//             location: 'Warehouse 1',
//             itemStatus: true,
//             itemQuantity: 10,
//             itemID: i,
//             type: 'Test'
//           })
//       );
//       concurrentPromises.push(
//         request(app)
//           .get('/api/get_products')
//       );
//       concurrentPromises.push(
//         request(app)
//           .delete(`/api/delete_product/${i}`)
//       );
//     }

//     await Promise.all(concurrentPromises);
//     const endTime = Date.now();
//     const duration = endTime - startTime;

//     expect(duration).toBeLessThan(10000);
//   });

  test('Memory Usage Test', async () => {
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    
    const userPromises = [];
    for (let i = 0; i < 100; i++) {
      userPromises.push(
        request(app)
          .post('/api/login')
          .send({ email: 'testuser@example.com', password: 'password' })
      );
    }

    await Promise.all(userPromises);
    const finalMemoryUsage = process.memoryUsage().heapUsed;
    const memoryDifference = finalMemoryUsage - initialMemoryUsage;

    expect(memoryDifference).toBeLessThan(100 * 1024 * 1024); // 100 MB
  });

  test('CPU Utilization Test', async () => {
    const startTime = Date.now();
    const cpuPromises = [];
    
    for (let i = 0; i < 100; i++) {
      cpuPromises.push(
        request(app)
          .post('/api/login')
          .send({ email: 'testuser@example.com', password: 'password' })
      );
    }

    await Promise.all(cpuPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(7500);
  });

  test('Network Bandwidth Usage Test', async () => {
    const startTime = Date.now();
    const networkPromises = [];
    
    for (let i = 0; i < 100; i++) {
      networkPromises.push(
        request(app)
          .get('/api/get_products')
      );
    }

    await Promise.all(networkPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(5000);
  });

});
