import './components/Smartfield.css';

import {
  toWidget,
  viewToModelPositionOutsideModelElement,
  Widget
} from '@ckeditor/ckeditor5-widget';

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

    this.editor.config.define('smartfieldProps', {
      initialSmartfields: [],
      onClick: undefined,
      allowedSmartfieldIds: undefined
    });

    this.allowedSmartfieldIds =
      this.editor.config.get('smartfieldProps').allowedSmartfieldIds;
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
      // if (disabled) {
      //   this.editor.stopListening(viewDocument, 'click');
      // } else {
      this._enableClickToEdit(this.editor, this.onClickHandler);
      // }
    });
  }

  _enableClickToEdit(editor, onClickHandler) {
    // Don't like this but it gets click handlers working
    this.onClickHandler = editor.config.get('smartfieldProps').onClick;

    if (typeof onClickHandler === 'function') {
      const viewDocument = editor.editing.view.document;

      editor.listenTo(viewDocument, 'click', (evt, data) => {
        const modelElement = editor.editing.mapper.toModelElement(data.target);

        const smartfields = this.editor.plugins.get(
          'SmartfieldsRepository'
        ).smartfields;
        if (modelElement && modelElement.name == 'smartfield') {
          if (
            (!this.allowedSmartfieldIds && !this.disableClick) ||
            (this.allowedSmartfieldIds &&
              this.allowedSmartfieldIds.includes(
                modelElement.getAttribute('id')
              ))
          ) {
            const repoSmartfield = smartfields.find(
              (f) => f.id === modelElement.getAttribute('id')
            );

            onClickHandler(repoSmartfield);
          }
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
        'counterpartytoprovide',
        'id',
        'signaturevariable', // Doesn't do anything in ck editor
        'title',
        'value'
      ]
    });
  }

  _defineConverters() {
    const { conversion } = this.editor;
    const { allowedSmartfieldIds } = this.editor.config.get('smartfieldProps');

    // UI to Model
    conversion.for('upcast').elementToElement({
      view: {
        name: 'button',
        classes: ['smartfield']
      },
      model: (viewElement, writer) => {
        const modelWriter = writer.writer;

        return modelWriter.createElement(
          'smartfield',
          _constructViewToModelAttributes(viewElement.getAttributes())
        );
      }
    });

    conversion.for('upcast').elementToElement({
      view: {
        name: 'button',
        classes: ['counterparty-smartfield']
      },
      model: (viewElement, writer) => {
        const modelWriter = writer.writer;

        return modelWriter.createElement(
          'smartfield',
          _constructViewToModelAttributes(viewElement.getAttributes())
        );
      }
    });

    conversion.for('upcast').elementToElement({
      view: {
        name: 'button',
        classes: ['signer-smartfield']
      },
      model: (viewElement, writer) => {
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
        const widgetElement = _createSmartfieldView(
          modelItem,
          viewWriter,
          allowedSmartfieldIds
        );
        return toWidget(widgetElement, viewWriter);
      }
    });

    // Model to Data View
    conversion.for('dataDowncast').elementToElement({
      model: 'smartfield',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        const result = _createSmartfieldView(
          modelItem,
          viewWriter,
          allowedSmartfieldIds
        );

        return result;
      }
    });

    function _createSmartfieldView(
      modelItem,
      viewWriter,
      allowedSmartfieldIds = []
    ) {
      const viewAttributes = _constructViewAttributesObject(
        modelItem.getAttributes()
      );

      const counterPartyToProvide = modelItem.getAttribute(
        'counterpartytoprovide'
      );

      const smartfieldViewButton = viewWriter.createContainerElement('button', {
        class:
          (counterPartyToProvide &&
            counterPartyToProvide.toString() === 'true' &&
            (allowedSmartfieldIds.includes(modelItem.getAttribute('id'))
              ? 'signer-smartfield'
              : 'counterparty-smartfield')) ||
          'smartfield',
        ...viewAttributes
      });

      const innerText = viewWriter.createText(
        // Show value, else fallback to title
        viewAttributes['smartfield-value'] || viewAttributes['smartfield-title']
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
        // Don't map the class attribute
        if (a[0] !== 'class')
          attributesObject[`smartfield-${a[0].toLowerCase()}`] = a[1];
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
