import {
  RefreshSmartfieldsListCommand,
  SmartfieldsRepositoryCommands
} from './commands';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UpdateSmartfieldCommand from './commands/UpdateSmartfieldCommand';

export default class SmartfieldsRepository extends Plugin {
  static get pluginName() {
    return 'SmartfieldsRepository';
  }

  init() {
    const { editor } = this;
    const initial = editor.config.get('smartfieldsrepository.initial') || [];
    this.smartfields = initial;
    this.editor.commands.add(
      SmartfieldsRepositoryCommands.RefreshSmartfieldsList,
      new RefreshSmartfieldsListCommand(this.editor)
    );
    this.editor.commands.add(
      SmartfieldsRepositoryCommands.UpdateSmartfield,
      new UpdateSmartfieldCommand(this.editor)
    );
    this.on(
      SmartfieldsRepositoryCommands.RefreshSmartfieldsList,
      this._handleRefreshSmartfieldList
    );
  }

  _handleRefreshSmartfieldList(event) {
    console.log(
      '🚀 ~ file: SmartfieldsRepository.js ~ line 37 ~ SmartfieldsRepository ~ _handleRefreshSmartfieldList ~ event',
      event
    );
  }
}
