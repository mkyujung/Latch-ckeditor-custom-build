import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import ConditionalsCommand from './ConditionalsCommand';
import ConditionalsRefreshCommand from './ConditionalsRefreshCommand';
import { viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';
import './conditionals.css'
import { RefreshSmartfieldsListCommand } from '../smartfields-repository/commands';
class ConditionalsEditing extends Plugin {
  static get pluginName() {
    return 'ConditionalsEditing';
  }

  constructor(editor) {
    super(editor);
  }

  init() {
    const editor = this.editor;

    console.log('EDITING INIT');

    editor.model.schema.extend('$text', { allowAttributes: 'conditional' });
    editor.model.schema.extend('paragraph', { allowChildren: 'conditional' });

    const options = editor.config.get('conditional.options');
    console.log('opt', options);


    this._defineSchema();

    editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
        viewElement.hasAttribute('conditional')
      )
    );

    this._defineConverters();

    editor.commands.add(
      ConditionalsCommand.eventId,
      new ConditionalsCommand(editor)
    );

    editor.commands.add(
      ConditionalsRefreshCommand.eventId,
      new ConditionalsRefreshCommand(editor)
    );

    editor.execute(ConditionalsRefreshCommand.eventId)
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    //
    schema.register('conditional', {
      // Behaves like a self-contained object (e.g. an image).
      // isObject: true,
      isInline: true,
      // isBlock: true,
      // // Allow in places where other blocks are allowed (e.g. directly in the root).
      // allowWhere: ['$block', '$text'],
      // allowChildren: ['$block', '$text'],
      allowIn: ['paragraph', '$text'],
      allowChildren: '$text',
      allowWhere: '$text',
      inheritAllFrom: '$block',
      allowAttributes: ["smartfield-id", 'condition', 'value', 'action', 'is-met']
    });
  }

  _defineConverters() {
    const { editor } = this;
    editor.conversion.for('downcast').elementToElement({
      model: 'conditional',
      view: (modelElement, { writer }) => {
        const attrs = {};

        const attrGenerator = modelElement.getAttributes();

        for (const attr of attrGenerator) {
          attrs[attr[0]] = attr[1];
        }


        console.log("converting model to view",attrs)
        const element = writer.createContainerElement(
          'conditional',
          // @ts-ignore
          attrs
        );

        console.log("ELEMET???",element)
        return element;
      }
    
    }).attributeToAttribute({
      model: "is-met",
      view: (modelValue) => ({
        key: "is-met",
        value: modelValue
      })
    });

    editor.conversion.for('upcast').elementToElement({
      view: 'conditional',
      model: (viewElement, { writer }) => {
        const attrs = {};

        const attrGenerator = viewElement.getAttributes();

        for (const attr of attrGenerator) {
          attrs[attr[0]] = attr[1];
        }

        // @ts-ignore
        const element = writer.createElement('conditional', attrs);


        return element;
      }
    });
  }
}

// mix(ConditionalsEditing, ObservableMixin);

export default ConditionalsEditing;
