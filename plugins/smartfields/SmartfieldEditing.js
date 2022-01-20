import './components/Smartfield.css';

import {
  toWidget,
  viewToModelPositionOutsideModelElement,
  Widget
} from '@ckeditor/ckeditor5-widget';

import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { ClickObserver } from '@ckeditor/ckeditor5-engine';
import InsertSmartfieldCommand from './commands/InsertSmartfieldCommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class SmartfieldEditing extends Plugin {
  static get pluginName() {
    return 'SmartfieldEditing';
  }

  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    // this.editor.conversion.for('downcast').add(downcastTest(this.editor));

    this.editor.commands.add(
      InsertSmartfieldCommand.eventId,
      new InsertSmartfieldCommand(this.editor)
    );

    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
        viewElement.hasClass('smartfield')
      )
    );

    this.editor.config.define('smartfieldBrackets', {
      open: '{',
      close: '}'
    });

    // Don't like this but it gets click handlers working
    this.onClickHandler = this.editor.config.get('smartfieldProps').onClick;
    this.clickObserver = this._enableClickToEdit(
      this.editor,
      this.onClickHandler
    );

    this.set('disableClick', this.editor.isReadOnly);
    this.bind('disableClick').to(this.editor, 'isReadOnly');
    this.on('change:disableClick', (info, ...args) => {
      const disabled = args[1];

      const viewDocument = this.editor.editing.view.document;
      if (disabled) {
        this.editor.stopListening(viewDocument, 'click');
      } else {
        this._enableClickToEdit(this.editor, this.onClickHandler);
      }
    });
  }

  _enableClickToEdit(editor, onClickHandler) {
    // Don't like this but it gets click handlers working
    this.onClickHandler = editor.config.get('smartfieldProps').onClick;

    if (typeof onClickHandler === 'function') {
      // const observer = editor.editing.view.addObserver(ClickObserver);
      const viewDocument = editor.editing.view.document;

      editor.listenTo(viewDocument, 'click', (evt, data) => {
        const modelElement = editor.editing.mapper.toModelElement(data.target);

        if (modelElement.name == 'smartfield') {
          onClickHandler(modelElement.getAttribute('id'));
        }
      });

      // return observer;
    }
  }

  _defineSchema() {
    const { schema } = this.editor.model;

    schema.register('smartfield', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,
      allowAttributes: [
        // Recheck this list to match smartfield properties
        // Best if it's short and has referential synchronisity with
        // document metadata smartfields array
        'color',
        'counterPartyToProvide',
        'id',
        'showCounterPartyToProvideCheckbox',
        'signatureVariable',
        'title',
        'value'
      ]
    });
  }

  _defineConverters() {
    const { conversion, config } = this.editor;

    // UI to Model
    conversion.for('upcast').elementToElement({
      view: {
        name: 'button',
        classes: ['smartfield']
      },
      model: (viewElement, writer) => {
        // Extract the "value" from {value}
        // const value = viewElement
        //   .getChild(0)
        //   .data.slice(
        //     config.get('smartfieldBrackets.open').length,
        //     0 - config.get('smartfieldBrackets.close').length
        //   )

        const modelWriter = writer.writer;

        return modelWriter.createElement(
          'smartfield',
          _constructViewToModelAttributes(viewElement.getAttributes())
        );
      }
    });

    // Model to HTML View
    conversion.for('editingDowncast').elementToElement({
      model: 'smartfield',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;

        const widgetElement = _createSmartfieldView(modelItem, viewWriter);
        const resultWidget = toWidget(widgetElement, viewWriter);

        return resultWidget;
      }
    });

    // Model to HTML View
    conversion.for('dataDowncast').elementToElement({
      model: 'smartfield',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        const smartfieldViewButton = new ButtonView(this.editor.locale);
        smartfieldViewButton.set({
          label: 'Test',
          withText: true
        });
        smartfieldViewButton.render();

        return _createSmartfieldView(modelItem, viewWriter);
      }
    });

    function _createSmartfieldView(modelItem, viewWriter) {
      const viewAttributes = _constructViewAttributesObject(
        modelItem.getAttributes()
      );

      const smartfieldViewButton = viewWriter.createContainerElement('button', {
        class: 'smartfield',
        ...viewAttributes
      });

      const innerText = viewWriter.createText(
        config.get('smartfieldBrackets.open') +
          // Show value, else fallback to title
          (viewAttributes['smartfield-value'] ||
            viewAttributes['smartfield-title']) +
          config.get('smartfieldBrackets.close')
      );

      viewWriter.insert(
        viewWriter.createPositionAt(smartfieldViewButton, 0),
        innerText
      );

      return smartfieldViewButton;
    }

    function _constructViewAttributesObject(attributesGenerator) {
      const attributesObject = {};

      for (const a of attributesGenerator) {
        attributesObject[`smartfield-${a[0]}`] = a[1];
      }

      return attributesObject;
    }

    function _constructViewToModelAttributes(attributesGenerator) {
      const attributesObject = {};

      for (const a of attributesGenerator) {
        attributesObject[a[0].replace('smartfield-', '')] = a[1];
      }

      return attributesObject;
    }
  }
}

function downcastTest(editor) {
  return (dispatcher) => {
    dispatcher.on(
      'insert:smartfield',
      (params) => {
        console.log(
          '🚀 ~ file: SmartfieldEditing.js ~ line 102 ~ SmartfieldEditing ~ return ~ params',
          params
        );
      },
      { priority: 'high' }
    );
  };
}
