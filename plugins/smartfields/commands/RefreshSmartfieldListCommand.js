import { Command } from '@ckeditor/ckeditor5-core';

// Synchronizes the list of smartfields in the toolbar UI
export default class RefreshSmartfieldListCommand extends Command {
  execute(commandParam) {
    console.log(commandParam);
  }
}
