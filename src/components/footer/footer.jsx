/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import TasksFilter from '../tasks-filter';
import './footer.css';

const Footer = ( { done, filter, onFilterChange, onDeleteCompleted }) => {

  return (
    <footer className="footer">
      <span className="todo-count">{done} items left</span>
      <TasksFilter filter={filter} onFilterChange={onFilterChange} />
      <button type="button" className="clear-completed" onClick={onDeleteCompleted}>
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;

Footer.propTypes = {
  filter: PropTypes.string.isRequired,
  done: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onDeleteCompleted: PropTypes.func.isRequired,
};
