import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// @ts-ignore
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ConditionalsCommand from './ConditionalsCommand';
import ConditionalsRepository from './ConditionalsRepository';


export default class ConditionalsToolbar extends Plugin {

  static get requires(){
    return [ConditionalsRepository]
  }

  constructor(editor){
    super(editor)
    this.bind("conditionals")
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

      
      const mockParams = {
        smartfieldId: "cl0eyx51u00003e6dg7bg8e0k",
        condition: "equals",
        value: "Latch"
      }

      view.on('execute', () => {
        this.editor.execute(ConditionalsCommand.eventId, mockParams);
      });


      return view;
    });
  }
}
