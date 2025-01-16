import { prisma } from '../../lib/prisma'; // Adjust the path based on your project structure
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, query, body } = req;

    console.log("check update method: "+method)

    switch (method) {
      // CREATE a new task
      case 'POST': {
        const { title, description, assignedTo, priority, status, deadline } = body;

        const newTask = await prisma.task.create({
          data: {
            title,
            description,
            assignedTo,
            priority,
            status,
            deadline: new Date(deadline), // Convert deadline string to a Date object
          },
        });

        return res.status(201).json(newTask);
      }

      // READ all tasks
      case 'GET': {
        const tasks = await prisma.task.findMany({
          include: { tags: true }, // Include related tags
        });

        return res.status(200).json(tasks);
      }

      // UPDATE a specific task
      case 'PUT': {
    
        // Extract the data from the body
        const { id, title, description, assignedTo, priority, status, deadline, tags } = body;
      
        // Check if ID is valid
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ message: 'Task ID is required and must be a string' });
        }
      
        try {
          // Update the task in the database
          const updatedTask = await prisma.task.update({
            where: { id },
            data: {
              title,
              description,
              assignedTo,
              priority,
              status,
              deadline: deadline ? new Date(deadline) : undefined, // Ensure the deadline is parsed correctly
               // Do not modify tags if the array is empty
            },
          });
      
          return res.status(200).json(updatedTask);
        } catch (error) {
          console.error('Error updating task:', error);
          return res.status(500).json({ message: 'Failed to update task' });
        }
    }

      // DELETE a specific task
      case 'DELETE': {
        console.log(body)
        const { id } = body; // Extract task ID from query string

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ message: 'Task ID is required and must be a string' });
        }

        await prisma.task.delete({
          where: { id },
        });

        return res.status(204).end(); // No content response
      }

      default:
        // Handle unsupported HTTP methods
        res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in /api/tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
