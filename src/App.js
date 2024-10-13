import "./styles.css";
import { FaPenAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useReducer, useState } from "react";

const ACTIONS = {
  ADD_TASK: "add-task",
  EDIT_TASK: "edit-task",
  DELETE_TASK: "delete-task",
  TOGGLE_COMPLETE: "toggle-complete",
};

function taskReducer(tasks, action) {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      return [...tasks, newTask(action.payload.name)];
    case ACTIONS.EDIT_TASK:
      return tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, name: action.payload.name }
          : task
      );
    case ACTIONS.DELETE_TASK:
      return tasks.filter((task) => task.id !== action.payload.id);
    case ACTIONS.TOGGLE_COMPLETE:
      return tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, complete: !task.complete }
          : task
      );
    default:
      return tasks;
  }
}

function newTask(name) {
  return { id: Date.now(), name: name, complete: false };
}

const TaskList = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [taskName, setTaskName] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskName.trim() === "") return;
    dispatch({ type: ACTIONS.ADD_TASK, payload: { name: taskName } });
    setTaskName("");
  };

  const handleEditTask = (task) => {
    setIsEditing(task.id);
    setEditedText(task.name);
  };

  const handleSaveEdit = (id) => {
    dispatch({ type: ACTIONS.EDIT_TASK, payload: { id, name: editedText } });
    setIsEditing(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isEditing !== null) {
        handleSaveEdit(isEditing);
      } else {
        handleAddTask(e);
      }
    }
  };

  return (
    <div className="task-list-container">
      <h1>Taskfiy</h1>
      {/* Input Section */}
      <form onSubmit={handleAddTask} className="task-input-form">
        <input
          type="text"
          placeholder="Enter a task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button type="submit">Go</button>
      </form>

      {}
      <div className="task-section">
        <div className="active-tasks">
          <h3>Active Task</h3>
          {tasks.map((task) => (
            <div
              className={`task-card ${task.complete ? "completed" : ""}`}
              key={task.id}
            >
              {isEditing === task.id ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              ) : (
                <span className={task.complete ? "completed-text" : ""}>
                  {task.name}
                </span>
              )}
              <div className="task-actions">
                {isEditing === task.id ? (
                  <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEditTask(task)}>
                      <FaPenAlt className="icon" />
                    </button>
                    <button
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.DELETE_TASK,
                          payload: { id: task.id },
                        })
                      }
                    >
                      <RiDeleteBin6Line className="icon" />
                    </button>
                    <button
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.TOGGLE_COMPLETE,
                          payload: { id: task.id },
                        })
                      }
                    >
                      {task.complete ? "✔✔" : "✔"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completed Task Section */}
        <div className="completed-tasks">
          <h3>Completed Task</h3>
          {tasks
            .filter((task) => task.complete)
            .map((task) => (
              <div className="task-card" key={task.id}>
                <span>{task.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
