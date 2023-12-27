import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

describe('Tasks Table Tests', () => {
    let createdTaskId: number | null = null;

    afterAll(async () => {
        // Clean up: Delete the created task after all tests
        if (createdTaskId) {
            await prisma.task.delete({ where: { id: createdTaskId } });
        }
        await prisma.$disconnect();
    });

    test('should create a new task', async () => {
        // Using TaskCreateInput type for taskData
        const taskData = {
            title: 'Sample Task',
            description: 'This is a sample task'
        };
        const task: Task = await prisma.task.create({ data: taskData });
        expect(task).toHaveProperty('id');
        expect(task.title).toBe(taskData.title);
        expect(task.description).toBe(taskData.description);
        expect(task).toHaveProperty('createdAt');

        createdTaskId = task.id;
    });

    test('should retrieve a task by ID', async () => {
        if (!createdTaskId) throw new Error('Task ID is null');

        const task: Task | null = await prisma.task.findUnique({ where: { id: createdTaskId } });
        expect(task).not.toBeNull();
        expect(task).toHaveProperty('id', createdTaskId);
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('description');
        expect(task).toHaveProperty('createdAt');
    });

    test('should update a task', async () => {
        if (!createdTaskId) throw new Error('Task ID is null');

        const updatedData = {
            title: 'Updated Task',
            description: 'Updated task description'
        };
        const task: Task = await prisma.task.update({
            where: { id: createdTaskId },
            data: updatedData,
        });
        expect(task.title).toBe(updatedData.title);
        expect(task.description).toBe(updatedData.description);
        expect(task).toHaveProperty('createdAt');
    });

    test('should delete a task', async () => {
        if (!createdTaskId) throw new Error('Task ID is null');

        const task: Task = await prisma.task.delete({ where: { id: createdTaskId } });
        expect(task).toHaveProperty('id', createdTaskId);

        createdTaskId = null;
    });
});
