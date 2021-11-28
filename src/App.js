import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  // STATES get passed down to components
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  const fetchTasksFromServer = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    console.log("fetchTasksFromServer... ", data);
    return data;
  };
  const fetchTaskFromServer = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    console.log("fetchTaskFromServer... ", data);
    return data;
  };

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasksFromServer();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  // ACTIONS get passed up from components
  const addTask = async (task) => {
    // console.log(`add task->${task.text}`);
    // console.log(task);
    // const id = Math.floor(Math.random() * 10000 + 1);
    // const newTask = { id, ...task };
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    console.log("addTask Response... ", data);
    setTasks([...tasks, data]);
  };
  const deleteTask = async (id) => {
    // console.log(`delete task->${id}`);
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const toggleReminder = async (id) => {
    // console.log(`toggle task->${id}`);
    const taskToToggle = await fetchTaskFromServer(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    const data = await res.json();
    console.log("toggleReminder Response... ", data);
    // setTasks(
    //   tasks.map((task) =>
    //     task.id === id ? { ...task, reminder: !task.reminder } : task
    //   )
    // );
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          title="Task Tracker"
          showAddTask={showAddTask}
          setShowAddTask={setShowAddTask}
        />
        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                "No Tasks To Show!"
              )}
            </>
          )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
