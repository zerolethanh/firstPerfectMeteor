import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function () {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: Meteor.userId() }
      ]
    });
  })
}

function checkOwner(task) {
  if (task.owner !== Meteor.userId()) {
    throw  new Meteor.Error('permission denied')
  }
  return true
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
    if (!Meteor.userId()) {
      throw new Meteor.Error('not authorized')
    }

    Tasks.insert(
        {
          text,
          createdAt: new Date(),
          owner: Meteor.userId(),
          username: Meteor.user().username || Meteor.user().profile.name,
          // user: this.props.currentUser
        }
    );
  },

  'tasks.remove'(task) {
    checkOwner(task);
    Tasks.remove(task._id)
  },

  'tasks.setChecked'(task, checked) {
    checkOwner(task);
    Tasks.update(task._id, { $set: { checked } })
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },

});