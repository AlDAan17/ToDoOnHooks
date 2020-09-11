import React, {useState} from 'react';
import './new-task-form.css';
import PropTypes from 'prop-types';
import Timer from "../../Services/timer";

const NewTaskForm = ({ onItemAdded }) => {

  const [fields, setFields] = useState({label: '', min: '', sec: '',});
  const {label, min, sec} = fields;

  const onLabelChange = (event) => {
    const { name, value } = event.target;
    setFields((previousFields) => ({ ...previousFields, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if(!label.trim()) return;
    const alreadyTime = new Timer(min, sec).format().result();
    onItemAdded(label.trim(), alreadyTime);
    setFields({
      label: '',
      min: '',
      sec:'',
    });
  };
    return (
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={onSubmit}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            name="label"
            onChange={onLabelChange}
            value={label}
          />
        </form>
      </header>
    );
}

NewTaskForm.propTypes = {
  onItemAdded:PropTypes.func.isRequired,
};

export default NewTaskForm;
