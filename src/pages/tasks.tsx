import { useState, useEffect } from 'react';

export default function Tasks() {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'To Do',
    deadline: ''
  });

  const [tasks, setTasks] = useState<any[]>([]); // State to store previous tasks
  const [selectedTask, setSelectedTask] = useState<any | null>(null); // State for editing a task

  // Fetch tasks when the component is mounted
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const fetchedTasks = await response.json();
          setTasks(fetchedTasks);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the task data to the API
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const createdTask = await response.json();
        alert('Task Created: ' + createdTask.title);

        // Clear the form fields after task creation
        setTask({
          title: '',
          description: '',
          assignedTo: '',
          priority: 'Medium',
          status: 'To Do',
          deadline: '',
        });

        // Update the tasks list
        setTasks((prevTasks) => [...prevTasks, createdTask]);
      } else {
        alert('Failed to create task');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the task');
    }
  };

  const handleEdit = (task: any) => {
    console.log("Edit task:", task);
    // Set the selected task to be edited
    setSelectedTask(task);
    setTask(task); // Populate form with selected task details
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTask?.id) {
      alert('No task selected for update');
      return;
    }

  
    // Send the updated task data to the API
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task), // Send the updated task details
      });
  
      if (response.ok) {
        const updatedTask = await response.json(); // Assume the response contains the updated task data
        alert('Task Updated: ' + updatedTask.title);
  
        // Update the tasks list
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
  
        // Clear the form fields after editing
        handleCancelEdit();
      } else {
        const errorData = await response.json();
        alert('Failed to update task: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the task');
    }
  };
  
  // // Handle canceling the edit and clearing the form
  const handleCancelEdit = () => {
    setSelectedTask(null); // Clear the selected task
    setTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: '',
      status: '',
      deadline: '',
    }); // Reset the task form fields with an empty structure
  };

  const handleDelete = async (id: string) => {
    console.log(`Delete task Data :: ${id}`); // Ensure this is printed
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), // Send taskId as part of an object
        });
  
        if (response.ok) {
          alert('Task Deleted');
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } else {
          alert('Failed to delete task data');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the task');
      }
    }
  };
  

  return (
    <div className="flex">
      {/* Left Side: List of all previous tasks */}
      <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Tasks</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
              <p className="text-sm text-gray-600">Status: {task.status}</p>
              <p className="text-sm text-gray-600">Priority: {task.priority}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side: Task Creation/Edit Form */}
      <div className="w-2/3 p-6 bg-white rounded-lg shadow-lg ml-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          {selectedTask ? 'EDIT TASK' : 'TASK CREATION'}
        </h1>

        <form onSubmit={selectedTask ? handleUpdate : handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Description</label>
            <textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assignedTo" className="block text-lg font-semibold text-gray-700">Assigned To</label>
            <input
              id="assignedTo"
              type="text"
              value={task.assignedTo}
              onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="block text-lg font-semibold text-gray-700">Priority</label>
            <select
              id="priority"
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-lg font-semibold text-gray-700">Status</label>
            <select
              id="status"
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-lg font-semibold text-gray-700">Deadline</label>
            <input
              id="deadline"
              type="date"
              value={task.deadline}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {selectedTask ? 'Update Task' : 'Create Task'}
            </button>
            {selectedTask && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
