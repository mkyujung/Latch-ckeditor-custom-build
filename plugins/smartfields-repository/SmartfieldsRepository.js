import {
  RefreshSmartfieldsListCommand,
  UpdateSmartfieldCommand
} from './commands';

import mix from '@ckeditor/ckeditor5-utils/src/mix';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

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

    // I don't know what this does, guess it initializes default config?
    editor.config.define('smartfieldProps', {
      initialSmartfields: []
    });

    const initial =
      editor.config.get('smartfieldProps.initialSmartfields') || [];

    this.set('smartfields', initial);

    // Register commands
    this.editor.commands.add(
      RefreshSmartfieldsListCommand.eventId,
      new RefreshSmartfieldsListCommand(this.editor)
    );

    this.editor.commands.add(
      UpdateSmartfieldCommand.eventId,
      new UpdateSmartfieldCommand(this.editor)
    );

    // Handlers
    this.editor.on(
      RefreshSmartfieldsListCommand.eventId,
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
    this.set('smartfields', [...params]);
  }
}

mix(SmartfieldsRepository, ObservableMixin);

export default SmartfieldsRepository;
