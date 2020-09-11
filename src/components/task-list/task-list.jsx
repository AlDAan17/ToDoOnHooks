import React from 'react';
import PropTypes from 'prop-types';
import Task from '../task';
import './task-list.css';

const TaskList = ({ todos, onDeleted, onToggleDone, onChangeEditMode, ...others }) => {
  const elements = todos.map((item) => {
    const { id } = item;
    return (
      <Task
        {...item}
        label={item.label}
        key={item.id}
        onDeleted={() => onDeleted(id)}
        onToggleDone={() => onToggleDone(id)}
        onChangeEditMode={() => onChangeEditMode(id)}
        {...others}
      />
    );
  });

  return <ul className="todo-list">{elements}</ul>;
};

export default TaskList;

TaskList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  onChangeEditMode: PropTypes.func.isRequired,
};
