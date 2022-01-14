import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import RefreshSmartfieldListCommand from './commands/RefreshSmartfieldListCommand.js';
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
    console.log('domdom', 'init');
    this.editor.commands.add(
      'refresh_smartfields_list',
      new RefreshSmartfieldListCommand(this.editor)
    );

    this.on('refresh_smartfields_list', (event) => console.log(event));
  }

  refresh() {
    console.log('domdom', 'refresh', this);
    const getSmartfields = this.editor.config.get(
      'smartfieldProps.getSmartfields'
    );

    getSmartfields().then((r) => {
      console.log('domdom', r);
    });
  }
}
