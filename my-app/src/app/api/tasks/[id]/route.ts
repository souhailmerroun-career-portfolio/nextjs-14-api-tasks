import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Logger from '@lib/Logger';

const prisma = new PrismaClient();
const logger = new Logger('app.log');

// GET - Fetch a single task by ID
export async function GET(
    request: Request,
    { params: { id } }: { params: { id: string } }
) {
    logger.info(`GET /api/tasks/${id} called at ${new Date().toISOString()}`);

    try {
        const taskId = parseInt(id, 10);

        // Validate if ID is a valid number
        if (isNaN(taskId)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid task ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        // Check if task exists
        if (!task) {
            return new NextResponse(JSON.stringify({ error: 'Task not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new NextResponse(JSON.stringify(task), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error fetching task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Patch - Update a task
export async function PATCH(
    request: Request,
    { params: { id } }: { params: { id: string } }
) {
    logger.info(`PATCH /api/tasks/${id} called at ${new Date().toISOString()}`);

    try {
        const taskId = parseInt(id, 10);

        // Validate if ID is a valid number
        if (isNaN(taskId)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid task ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { title, description } = await request.json();

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { title, description },
        });

        return new NextResponse(JSON.stringify(updatedTask), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error updating task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Delete - Delete a task
export async function DELETE(
    request: Request,
    { params: { id } }: { params: { id: string } }
) {
    logger.info(`DELETE /api/tasks/${id} called at ${new Date().toISOString()}`);

    try {
        const taskId = parseInt(id, 10);

        // Validate if ID is a valid number
        if (isNaN(taskId)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid task ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return new NextResponse(JSON.stringify({ message: 'Task deleted' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error deleting task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}