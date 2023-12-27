import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Task data for creating tasks
const taskData1 = { title: 'Task 1', description: 'Description of Task 1' };
const taskData2 = { title: 'Task 2', description: 'Description of Task 2' };
const updatedTaskData = { title: 'Updated Task', description: 'Updated Description' };

test.describe('Tasks API tests', () => {

  test('should list all tasks', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/tasks`);
    expect(response.status()).toBe(200);

    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBeTruthy();

    // Check if each task in the array has the expected structure
    if (tasks.length > 0) {
      tasks.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('description');
      });
    }
  });

  test('should create a new task', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/tasks`, { data: taskData1 });
    expect(response.status()).toBe(201);
    const task = await response.json();
    expect(task).toMatchObject(taskData1);
  });

  test('should get a task by ID', async ({ request }) => {
    // First, create a task to get its ID
    const createResponse = await request.post(`${BASE_URL}/tasks`, { data: taskData2 });
    const newTask = await createResponse.json();

    // Now, get the task by ID
    const response = await request.get(`${BASE_URL}/tasks/${newTask.id}`);
    expect(response.status()).toBe(200);
    const task = await response.json();
    expect(task).toMatchObject(taskData2);
  });

  test('should update a task', async ({ request }) => {
    // First, create a task to update
    const createResponse = await request.post(`${BASE_URL}/tasks`, { data: taskData1 });
    const newTask = await createResponse.json();

    // Now, update the task
    const updateResponse = await request.put(`${BASE_URL}/tasks/${newTask.id}`, { data: updatedTaskData });
    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();
    expect(updatedTask).toMatchObject(updatedTaskData);
  });

  test('should delete a task', async ({ request }) => {
    // First, create a task to delete
    const createResponse = await request.post(`${BASE_URL}/tasks`, { data: taskData1 });
    const newTask = await createResponse.json();

    // Now, delete the task
    const deleteResponse = await request.delete(`${BASE_URL}/tasks/${newTask.id}`);
    expect(deleteResponse.status()).toBe(200);
  });

});
