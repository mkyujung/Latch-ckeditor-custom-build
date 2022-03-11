import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import ConditionalsCommand from './ConditionalsCommand';
import ConditionalsRefreshCommand from './ConditionalsRefreshCommand';
import { viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import { RefreshSmartfieldsListCommand } from '../smartfields-repository/commands';
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

    const options = editor.config.get('conditional.options');
    console.log('opt', options);

    this._defineSchema();

    editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
        viewElement.hasAttribute('conditional')
      )
    );

    // this.listenTo(new RefreshSmartfieldsListCommand(this.editor), "execute", () => {

    //   console.log("WOAH CANT BELIEVE THIS ACTUALLY WORKS WOW")
    // })

    // this.on(RefreshSmartfieldsListCommand.eventId, () => {
    //   console.log('WOAH CANT BELIEVE THIS ACTUALLY WORKS WOW');
    // });

    // editor.conversion.elementToElement({
    //   model: "conditional",
    //   view: "conditional"
    // })

    editor.conversion.for('downcast').elementToElement({
      model: 'conditional',
      view: (modelElement, { writer }) => {
        const attrs = {};

        const attrGenerator = modelElement.getAttributes();

        for (const attr of attrGenerator) {
          attrs[attr[0]] = attr[1];
        }

        const element = writer.createEditableElement(
          'conditional',
          // @ts-ignore
          attrs
        );
        return element;
      }
    });

    editor.conversion.for('upcast').elementToElement({
      view: 'conditional',
      model: (viewElement, { writer }) => {
        const attrs = {};

        const attrGenerator = viewElement.getAttributes();

        for (const attr of attrGenerator) {
          attrs[attr[0]] = attr[1];
        }

        console.log('VIEW ELEMENT', viewElement);

        // @ts-ignore
        const element = writer.createElement('conditional', attrs);
        return element;
      }
    });

    editor.commands.add(
      ConditionalsCommand.eventId,
      new ConditionalsCommand(editor)
    );

    editor.commands.add(
      ConditionalsRefreshCommand.eventId,
      new ConditionalsRefreshCommand(editor)
    );
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    //
    schema.register('conditional', {
      // Behaves like a self-contained object (e.g. an image).
      isObject: true,
      isInline: true,
      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: ['$block', '$text'],
      allowChildren: '$text'
    });
  }
}
