import Logger from '@lib/Logger';
import { PrismaClient, Task } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const logger = new Logger('app.log');

// GET - List all tasks
export async function GET() {
    logger.info('GET /api/tasks called at ' + new Date().toISOString());

    try {
        const tasks: Task[] = await prisma.task.findMany();
        return NextResponse.json(tasks);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error fetching tasks' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
    logger.info('POST /api/tasks called at ' + new Date().toISOString());

    try {
        const { title, description } = await request.json();
        const newTask = await prisma.task.create({ data: { title, description } });
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error creating task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}