import { Command } from '@ckeditor/ckeditor5-core';

export default class UpdateSmartfieldCommand extends Command {
  static eventId = 'update-smartfield';

  execute(smartfield) {
    console.log(`Updated smartfield ${smartfield}`);
  }
}
