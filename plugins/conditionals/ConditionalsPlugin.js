import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// @ts-ignore
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ConditionalsCommand from './ConditionalsCommand';
import ConditionalsEditing from './ConditionalsEditing';

export default class ConditionalsPlugin extends Plugin {
  static get requires() {
    return [ConditionalsEditing];
  }
  init() {
    const { editor } = this;

    // @ts-ignore
    editor.ui.componentFactory.add('conditionalsButton', (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Conditional Button',
        icon: imageIcon,
        tooltip: true
      });

      view.on('execute', () => {
        this.editor.execute(ConditionalsCommand.eventId);
      });

      return view;
    });
  }
}
