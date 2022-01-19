import { ButtonView } from '@ckeditor/ckeditor5-ui';
import EditSmartfieldCommand from '../commands/EditSmartfieldCommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class SmartfieldUI extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.commands.add(
      EditSmartfieldCommand.eventId,
      new EditSmartfieldCommand(editor)
    );

    // The "simpleBox" button must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add('smartfield', (locale) => {
      // The state of the button will be bound to the widget command.
      const command = editor.commands.get(EditSmartfieldCommand.eventId);

      // The button will be an instance of ButtonView.
      const buttonView = new ButtonView(locale);

      buttonView.set({
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t('What on earth'),
        withText: true,
        tooltip: true
      });

      // Bind the state of the button to the command.
      buttonView.bind('id', 'value').to(command, 'id', 'value');

      // Execute the command when the button is clicked (executed).
      this.listenTo(buttonView, 'execute', () =>
        editor.execute(EditSmartfieldCommand.eventId)
      );

      return buttonView;
    });
  }

  refresh() {
    this.isEnabled = !this.editor.isReadOnly;
  }
}
