import { Command } from '@ckeditor/ckeditor5-core';

export default class UpdateSmartfieldCommand extends Command {
  execute(commandParams) {
    console.log('Update smartfield command', commandParams);
  }
}
