import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import '../imports/startup/accounts-config'

import App from '../imports/ui/App.js'

Meteor.startup(function () {
  return render(<App/>, document.getElementById('render-target'));
});
// import ImageGallery from '../imports/ui/ImageGallery'

// Meteor.startup(() => {
//   return render(<ImageGallery/>, document.getElementById('render-target'));
// })