import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SmartfieldEditing from './SmartfieldEditing.js';
import SmartfieldUi from './components/SmartfieldUi.jsx';

export default class SmartfieldPlugin extends Plugin {
  static get pluginName() {
    return 'Smartfield';
  }

  static get requires() {
    return [SmartfieldEditing, SmartfieldUi];
  }

  init() {
    const smartfields = this.editor.config.get('smartfieldProps.types') || [];
    console.log('domdom', 'init');
    this.localCopy = smartfields;
  }

  refresh() {
    console.log('domdom', 'refresh');
    const getSmartfields = this.editor.config.get(
      'smartfieldProps.getSmartfields'
    );

    getSmartfields().then((r) => {
      console.log('domdom', r);
    });
  }
}
