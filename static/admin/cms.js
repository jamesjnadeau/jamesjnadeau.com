import React from "react";
import { render } from "react-dom";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-jade";


import CMS from 'netlify-cms'

var PugControl = createClass({
  handleChange: function(value, e) {
    console.log('handleChange');
    this.props.onChange(e.target.value);
  },
  render: function() {
    var value = this.props.value;
    return React.createElement(AceEditor, {
      onChange: this.handleChange,
      name: 'jade-editor',
      value: value,
      mode: "jade",
      theme: "github",
      style: {
        border: '1px solid #eee',
        width: '100%',
      },
    });
  }
});

var PugPreview = createClass({
  render: function() {
  var html;
    try {
      html = pug.render(this.props.value)
      return h('div', {
        dangerouslySetInnerHTML: {__html: html}
      });
    }
    catch(err) {
      console.log(err);
      var err_message = JSON.stringify(err, null, 2);
      return h('pre', {
        dangerouslySetInnerHTML: {__html: err_message},
      })
    }
    
  }
});

CMS.registerWidget('pug', PugControl, PugPreview);