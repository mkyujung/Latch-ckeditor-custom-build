import {
  RefreshSmartfieldsListCommand,
  SmartfieldsRepositoryCommands
} from './commands';

import mix from '@ckeditor/ckeditor5-utils/src/mix';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UpdateSmartfieldCommand from './commands/UpdateSmartfieldCommand';

class SmartfieldsRepository extends Plugin {
  static get pluginName() {
    return 'SmartfieldsRepository';
  }

  constructor(editor) {
    super(editor);
    this.bind('smartfields');
  }

  init() {
    const { editor } = this;
    const initial =
      editor.config.get('smartfieldProps.initialSmartfields') || [];

    this.set('smartfields', initial);

    // Register
    this.editor.commands.add(
      SmartfieldsRepositoryCommands.RefreshSmartfieldsList,
      new RefreshSmartfieldsListCommand(this.editor)
    );
    this.editor.commands.add(
      SmartfieldsRepositoryCommands.UpdateSmartfield,
      new UpdateSmartfieldCommand(this.editor)
    );

    // Handlers
    this.editor.on(
      SmartfieldsRepositoryCommands.RefreshSmartfieldsList,
      this._handleRefreshSmartfieldList.bind(this)
    );

    // Observable change
    // this.on('change:smartfields', (evt, propertyName, newValue, oldValue) => {
    //   console.log(
    //     `#${propertyName} has changed from "${oldValue}" to "${newValue}"`
    //   );
    // });
  }

  _handleRefreshSmartfieldList(event, params) {
    this.set('smartfields', params);
  }
}

mix(SmartfieldsRepository, ObservableMixin);

export default SmartfieldsRepository;
