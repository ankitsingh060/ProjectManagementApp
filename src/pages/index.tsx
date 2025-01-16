import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={() => signIn('discord')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-400 focus:outline-none"
        >
          Login with Discord
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Welcome, {session.user?.name}!</h2>

          <div className="space-m-4">
            <Link href="/profile">
              <div className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-400 focus:outline-none mb-4">
                Create/Update Profile
              </div>
            </Link>

            <Link href="/tasks">
              <div className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-400 focus:outline-none">
                  Task Management
              </div>
            </Link>
          </div>

          
          

          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-400 focus:outline-none mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
