import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ConditionalsCommand from './ConditionalsCommand';

export default class ConditionalsEditing extends Plugin {
  static get pluginName() {
    return 'ConditionalsEditing';
  }

  constructor(editor) {
    super(editor);
  }

  init() {
    const editor = this.editor;

    editor.model.schema.extend('$text', { allowAttributes: 'conditional' });

    editor.commands.add(
      ConditionalsCommand.eventId,
      new ConditionalsCommand(editor)
    );
  }
}
