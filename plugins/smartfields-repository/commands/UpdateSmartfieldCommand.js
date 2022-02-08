import { Command } from '@ckeditor/ckeditor5-core';

export default class UpdateSmartfieldCommand extends Command {
  static eventId = 'update-smartfield';

  execute(commandParams) {
    console.log('Update smartfield command', commandParams);
  }

  // refresh() {
  //   const { isReadOnly } = this.editor;
  //   this.isEnabled = !isReadOnly;
  // }
}
