import React from 'react';
import './app.css';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';

export default class App extends React.Component {
  maxId = 100;

  timers = {};

  state = {
    filter: 'all',
    term: '',
    todoData: [],
  };

  onTimerOn = (id) => {
    if (this.timers[id]) return;
        this.timers[id] = setInterval(() => {
          // eslint-disable-next-line no-shadow
          const {todoData} = this.state;
          const i = todoData.findIndex((el) => el.id === id);
          if(todoData[i].done) return;
          const [min, sec] = todoData[i].alreadyTime;
          this.onEditing(id, {alreadyTime: [min, sec + 1]});
        }, 1000);
  };

  onTimerOff = (id) => {
    clearInterval(this.timers[id]);
    delete this.timers[id];
  };

  onEditing = (id, obj, elementDOM) => {
    this.setState(
        ({ todoData }) => {
          const index = todoData.findIndex((el) => el.id === id);
          const oldItem = todoData[index];
          const newItem = { ...oldItem, ...obj };
          const newArray = [...todoData.slice(0, index), newItem, ...todoData.slice(index + 1)];
          return {
            todoData: newArray,
          };
        },
        () => {
          if (elementDOM) elementDOM.focus();
        }
    );
  };

  onDeleteCompleted = () => {
    this.setState(({ todoData }) => {
      const newArray = todoData.filter((item) => {
        const { done, id  } = item;
        if(done) this.onTimerOff(id);
        return done === false;
      });
      return {
        todoData: newArray,
      };
    });
  };

  onFilterChange = (filter) => {
    this.setState({ filter });
  };

  onToggleDone = (id) => {

    this.setState(({ todoData }) => {
      if(!todoData.done) this.onTimerOff(id)
      return {
        todoData: this.toggleProperty(todoData, id, 'done'),
      };
    });
  };

  onChangeEditMode = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'editMode'),
      };
    });
  };

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      this.onTimerOff(id);
      const idx = todoData.findIndex((el) => el.id === id);
      const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];
      return {
        todoData: newArray,
      };
    });
  };

  addItem = (text, alreadyTime) => {
    const newItem = this.createTodoItem(text, alreadyTime);

    this.setState(({ todoData }) => {
      const newArr = [...todoData, newItem];
      return {
        todoData: newArr,
      };
    });
  };

  search(items, term) {
    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

  filter(items, filter) {
    switch (filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'completed':
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] };

    return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
  }

  createTodoItem(label, alreadyTime) {
    const id = this.maxId;
    this.maxId += 1;
    return {
      label,
      done: false,
      editMode: false,
      filter: 'all',
      nameOfClass: 'active',
      time: new Date(),
      id,
      alreadyTime,
    };
  }

  render() {
    const { todoData, term, filter } = this.state;
    const visibleItems = this.filter(this.search(todoData, term), filter);
    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;
    return (
      <section className="todoapp">
        <NewTaskForm onItemAdded={this.addItem} />
        <TaskList
          todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleDone={this.onToggleDone}
          todoData={todoData}
          onChangeEditMode={this.onChangeEditMode}
          onSubmitFormTask={this.onSubmitFormTask}
          edit={this.onEditing}
          timerOn={this.onTimerOn}
          timerOff={this.onTimerOff}
        />
        <Footer
          done={todoCount}
          filter={filter}
          onFilterChange={this.onFilterChange}
          onDeleteCompleted={this.onDeleteCompleted}
        />
      </section>
    );
  }
}
