import React from 'react';
import PropTypes from 'prop-types';
import './tasks-filter.css';

export default class TaskFilter extends React.Component {
  buttons = [
    { name: 'all', label: 'All' },
    { name: 'active', label: 'Active' },
    { name: 'completed', label: 'Completed' },
  ];

  render() {
    const { filter, onFilterChange } = this.props;

    const buttons = this.buttons.map(({ name, label }) => {
      const isActive = filter === name;
      const clazz = isActive ? ' selected' : '';
      return (
        <li key={name}>
          <button className={clazz} type="button" onClick={() => onFilterChange(name)}>
            {label}
          </button>
        </li>
      );
    });

    return (
      <ul className="filters">
        {buttons}
      </ul>
    );
  }
}

TaskFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
