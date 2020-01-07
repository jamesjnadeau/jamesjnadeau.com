import CMS from 'netlify-cms';
import controlComponent from 'netlify-cms-widget-code/dist/esm/CodeControl';

CMS.registerPreviewStyle('/styles/built/styles.css');

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

var TILPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    return h('div', {},
      h('navbar', {className: 'navbar navbar-expand-lg navbar-dark fixed-top', id:'header'}, 'James J Nadeau'),
      // h('h1', {}, entry.getIn(['data', 'title'])),
      h('div', { className: 'container', id: 'container'},
        h('div', { className: "content"}, this.props.widgetFor('body'))
      )
    );
  }
});

CMS.registerPreviewTemplate("TIL", TILPreview);