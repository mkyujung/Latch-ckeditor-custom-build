import { Command } from '@ckeditor/ckeditor5-core';

// Synchronizes the list of smartfields in the toolbar UI
export default class RefreshSmartfieldsListCommand extends Command {
  static eventId = 'refresh-smartfield-list';
}
