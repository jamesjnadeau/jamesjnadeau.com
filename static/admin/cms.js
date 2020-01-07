import CMS from 'netlify-cms';
import controlComponent from 'netlify-cms-widget-code/dist/esm/CodeControl';


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

// CMS.registerWidget('pug', PugControl, PugPreview);
CMS.registerWidget('pug', controlComponent, PugPreview);
CMS.getWidget('pug').codeMirrorConfig = {
  mode: 'pug',
  theme: 'default',
};