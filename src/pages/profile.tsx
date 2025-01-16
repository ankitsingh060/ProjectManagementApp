import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Profile() {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    image: '',
  });

  // Load the profile data when the user is logged in
  useEffect(() => {
    if (session?.user) {
      setUserProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || '',
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the updated profile data to the API
    try {
  
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        const updateProfile = await response.json();
        alert('Profile Updated: ' + updateProfile.email);
      } else {
        alert('Failed to create task');
      }




      if (response.ok) {
        alert("Updated Profile SuccessFul");
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the profile');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block">Avatar (Image URL)</label>
            <input
              type="text"
              value={userProfile.image}
              onChange={(e) => setUserProfile({ ...userProfile, image: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-400 focus:outline-none"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
