import React from 'react'
import ReactDom from 'react-dom'

import Task from './Task'

import PropTypes from 'prop-types'

import { Tasks } from '../api/tasks'
import { createContainer } from 'meteor/react-meteor-data'
import AccountUIWrapper from './AccountUIWrapper'

class App extends React.Component {

  state = {
    hideCompleted: false
  };

  renderTasks() {
    let tasks = this.props.tasks;
    if (this.state.hideCompleted) {
      tasks = tasks.filter((t) => {
        return !t.checked
      })
    }
    return tasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
          <Task
              key={task._id}
              task={task}
              showPrivateButton={showPrivateButton}
          />)
    })
  }

  toggleHideCompleted = () => {
    const hideCompleted = !this.state.hideCompleted;
    console.log({ hideCompleted });
    this.setState({ hideCompleted })
  };

  render() {
    return (
        <div className={'container'}>
          <header>
            Tasks ({this.props.inCompletedCount})
            <label className={'hide-completed'}>
              Hide Completed
              <input className={'hide-completed'}
                     type={'checkbox'}
                     readOnly
                     checked={this.state.hideCompleted}
                     onClick={this.toggleHideCompleted}
              />

            </label>
            <AccountUIWrapper/>
            {this.props.currentUser ?
                <form className={'new-task'} onSubmit={this.addTask}>
                  <input type={'text'} ref={(taskTextInput) => this.taskTextInput = taskTextInput}
                         placeholder={'add new task'}/>
                </form> : ''
            }
          </header>
          <ul>
            {this.renderTasks()}
          </ul>
        </div>
    );
  }

  addTask = (e) => {
    e.preventDefault();
    const text = this.taskTextInput.value.trim();
    if (text === '') {
      alert('no no no ');
      this.taskTextInput.focus();
      return;
    }
    Meteor.call('tasks.insert', text);
    this.taskTextInput.value = ''
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { owner: Meteor.userId(), createdAt: -1 } }).fetch(),
    inCompletedCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),

  }
}, App)