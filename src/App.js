import React, { useState, useEffect } from 'react';
import AddTask from './addtask';

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [editableTaskIndex, setEditableTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [customers, setCustomers] = useState([]);
  const [staticData, setStaticData] = useState([
    { id: 1, name: 'John Doe', items: ['Item l'] },
    { id: 2, name: 'John Doe', items: ['Item h'] },
    { id: 3, name: 'John Doe', items: ['Item g'] },
    { id: 4, name: 'John Doe', items: ['Item sdf', 'Item sdf', 'Item sdf', 'Item sdf', 'Item sdf'] },
    { id: 5, name: 'Jane Smith', items: ['Item A', 'Item B', 'Item C'] },
    { id: 6, name: 'Alice Johnson', items: ['Item X', 'Item Y', 'Item Z'] },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [displayStaticData, setDisplayStaticData] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    console.log('Stored tasks:', storedTasks);
    console.log('Stored completed tasks:', storedCompletedTasks);
    setTasks(storedTasks);
    setCompletedTasks(storedCompletedTasks);

    // Extract unique customer names from static data
    const uniqueCustomers = Array.from(new Set(staticData.map((data) => data.name)));
    // Create customer objects with total items count
    const customerObjects = uniqueCustomers.map((name) => ({
      name,
      totalItems: staticData.filter((data) => data.name === name).reduce((acc, curr) => acc + curr.items.length, 0),
    }));
    setCustomers(customerObjects);
  }, []);

  useEffect(() => {
    if (tasks.length) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    if (completedTasks.length) {
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
  }, [tasks, completedTasks]);

  const addTask = (task) => {
    setTasks([...tasks, { text: task, completed: false }]);
    setShowAddTask(false);
  };

  const completeTask = (taskIndex) => {
    const updatedTasks = [...tasks];
    const completedTask = updatedTasks.splice(taskIndex, 1)[0];
    completedTask.completed = true;
    setCompletedTasks([...completedTasks, completedTask]);
    setTasks(updatedTasks);
  };

  const toggleCompletedTasks = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  const handleEdit = (index) => {
    setEditableTaskIndex(index);
    setEditedTask(tasks[index].text);
  };

  const handleSave = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editedTask;
    setTasks(updatedTasks);
    setEditableTaskIndex(null);
  };

  const handleCancelEdit = () => {
    setEditableTaskIndex(null);
  };

  const handleCheckboxChange = (name) => {
    setSelectedCustomer(name);
    const customerData = staticData.filter((customer) => customer.name === name);
    setDisplayStaticData(customerData);
  };

  return (
    <div>
      <h1>Add Tasks</h1>
      {showAddTask ? (
        <AddTask onAddTask={addTask} onCancel={() => setShowAddTask(false)} />
      ) : (
        <button onClick={() => setShowAddTask(true)}>Add New Task</button>
      )}
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {editableTaskIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button onClick={() => handleSave(index)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                  onClick={() => handleEdit(index)}
                >
                  {task.text}
                </span>
                {!task.completed && (
                  <button onClick={() => completeTask(index)}>Complete</button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={toggleCompletedTasks}>Completed Tasks</button>
      {showCompletedTasks && (
        <ul>
          {completedTasks.map((task, index) => (
            <li key={index} style={{ textDecoration: 'line-through' }}>
              {task.text}
            </li>
          ))}
        </ul>
      )}

      {/* Table with checkboxes */}
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Total Items</th>
            <th>Checkbox</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.name}>
              <td>{customer.name}</td>
              <td>{customer.totalItems}</td>
              <td>
                <input
                  type="checkbox"
                  checked={customer.name === selectedCustomer}
                  onChange={() => handleCheckboxChange(customer.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {displayStaticData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            {displayStaticData.map((customer) =>
              customer.items.map((item, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{item}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
