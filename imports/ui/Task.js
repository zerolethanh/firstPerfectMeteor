import React from 'react'

import { Meteor } from 'meteor/meteor'

import classnames from 'classnames'

export default class Task extends React.Component {

  toggleCheck = () => {

    Meteor.call('tasks.setChecked', this.props.task, !this.props.task.checked);
  };

  deleteThisTask = (e) => {
    Meteor.call('tasks.remove', this.props.task)
  };

  togglePrivate = () => {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  };

  render() {

    const taskClassNames = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private
    });
    return (

        <li className={taskClassNames}>
          {this.props.task.owner === Meteor.userId() &&
          <button className={'delete'} onClick={this.deleteThisTask}>&times;</button>
          }

          <input type={'checkbox'}
                 readOnly={true}
                 checked={this.props.task.checked}
                 onClick={this.toggleCheck}
          />
          {this.props.showPrivateButton ? (
              <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                {this.props.task.private ? 'Private' : 'Public'}
              </button>
          ) : ''}

          <span onClick={this.toggleCheck}><strong>{this.props.task.username}</strong>: {this.props.task.text}</span>
        </li>
    );
  }
}