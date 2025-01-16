// pages/api/profile.ts
import { prisma } from '../../lib/prisma'; // Adjust based on where prisma is located
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, image} = req.body;

    try {
        // Ensure we update user profile in the database
        const updatedUser = await prisma.user.update({
            where: {
            email: email, // Use email from session
            },
            data: {
            name: name || undefined, // Optional field
            image: image || undefined, // Optional field
            },
        });

        // Respond with the updated user data
        return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // Handle other HTTP methods (e.g., GET)
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
