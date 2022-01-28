import './SignatureBlock.css';

import { ContextPlugin, Plugin } from '@ckeditor/ckeditor5-core';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

import { InsertSignatureBlockCommand } from '../commands';
import SmartfieldsRepository from '../../smartfields-repository/SmartfieldsRepository';
import UpdateSignatureBlockCommand from '../commands/UpdateSignatureBlockCommand';

export default class SignatureBlock extends Plugin {
  static get requires(): Array<typeof Plugin | typeof ContextPlugin | string> {
    return [SmartfieldsRepository];
  }

  init(): void {
    this._defineConverters();
    this._defineSchema();

    const { editor } = this;

    editor.commands.add(
      InsertSignatureBlockCommand.eventId,
      new InsertSignatureBlockCommand(editor)
    );

    editor.commands.add(
      UpdateSignatureBlockCommand.eventId,
      new UpdateSignatureBlockCommand(editor)
    );

    this.editor.config.define('signatures', {
      renderSignature: () => console.log('test render')
    });
  }

  _defineSchema(): void {
    const { schema } = this.editor.model;

    schema.register('signatureBlock', {
      allowWhere: '$block',
      isObject: true,
      allowContentOf: '$block',
      allowAttributes: ['blockId']
    });

    schema.register('signingParty', {
      allowIn: 'signatureBlock',
      allowContentOf: '$block',
      isLimit: true,
      allowAttributes: ['smartfieldId']
    });

    schema.register('signatureField', {
      isLimit: true,
      allowIn: 'signatureBlock',
      allowAttributes: ['signature', 'blockId'],
      allowChildren: ['$block']
    });

    schema.register('signerName', {
      isLimit: true,
      allowIn: 'signatureBlock',
      allowContentOf: '$block',
      isBlock: true,
      allowAttributes: ['smartfieldId']
    });
  }

  _defineConverters(): void {
    const { conversion, config } = this.editor;
    const renderSignature = config.get('signatures').renderSignature;

    // Signature block
    conversion.for('upcast').elementToElement({
      // model: 'signatureBlock',
      model: (viewElement, writer) => {
        const modelWriter = writer.writer;

        return modelWriter.createElement('signatureBlock', {
          blockId: viewElement.getAttribute('blockid')
        });
      },
      view: {
        name: 'section',
        classes: 'signature-block'
      }
    });
    conversion.for('dataDowncast').elementToElement({
      model: 'signatureBlock',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        return viewWriter.createContainerElement('section', {
          class: 'signature-block',
          blockId: modelItem.getAttribute('blockId')
        });
      }
    });
    conversion.for('editingDowncast').elementToElement({
      model: 'signatureBlock',
      view: (modelElement, { writer: viewWriter }) => {
        const section = viewWriter.createContainerElement('section', {
          class: 'signature-block',
          blockId: modelElement.getAttribute('blockId')
        });

        return toWidget(section, viewWriter, {
          label: 'Signature Block Widget'
        });
      }
    });

    // Signing party
    conversion.for('upcast').elementToElement({
      model: (viewElement, writer) => {
        const modelWriter = writer.writer;

        return modelWriter.createElement('signingParty', {
          smartfieldId: viewElement.getAttribute('smartfieldid')
        });
      },
      view: {
        name: 'p',
        classes: 'signing-party'
      }
    });
    conversion.for('dataDowncast').elementToElement({
      model: 'signingParty',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        return viewWriter.createContainerElement('p', {
          class: 'signing-party',
          smartfieldId: modelItem.getAttribute('smartfieldId')
        });
      }
    });
    conversion.for('editingDowncast').elementToElement({
      model: 'signingParty',
      view: (modelElement, { writer: viewWriter }) => {
        const p = viewWriter.createContainerElement('p', {
          class: 'signing-party',
          smartfieldId: modelElement.getAttribute('smartfieldId')
        });

        return p;
      }
    });

    // Signature field
    conversion.for('upcast').elementToElement({
      model: (viewElement, writer) => {
        const modelWriter = writer.writer;

        return modelWriter.createElement('signatureField', {
          signature: viewElement.getAttribute('signature') || '',
          blockId: viewElement.getAttribute('block-id')
        });
      },
      view: {
        name: 'div',
        classes: 'signature-field'
      }
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'signatureField',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        const div = viewWriter.createContainerElement('div', {
          class: 'signature-field',
          signature: modelItem.getAttribute('signature'),
          'block-id': modelItem.getAttribute('blockId')
        });

        return div;
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'signatureField',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        const fieldWrapper = viewWriter.createContainerElement('div', {
          class: 'signature-field',
          signature: modelItem.getAttribute('signature'),
          'block-id': modelItem.getAttribute('blockId')
        });

        const reactWrapper = viewWriter.createRawElement(
          'div',
          {},
          function (domElement) {
            renderSignature(modelItem.getAttribute('blockId'), domElement);
          }
        );

        viewWriter.insert(
          viewWriter.createPositionAt(fieldWrapper, 0),
          reactWrapper
        );

        return fieldWrapper;
        // To make the signature field deletable and moveable, make it a widget
        return toWidget(fieldWrapper, viewWriter);
      }
    });

    // Signer name
    conversion.for('upcast').elementToElement({
      model: (viewElement, writer) => {
        const modelWriter = writer.writer;

        return modelWriter.createElement('signerName', {
          smartfieldId: viewElement.getAttribute('smartfieldid')
        });
      },
      view: {
        name: 'p',
        classes: 'signer-name'
      }
    });
    conversion.for('dataDowncast').elementToElement({
      model: 'signerName',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        return viewWriter.createContainerElement('p', {
          class: 'signer-name',
          smartfieldId: modelItem.getAttribute('smartfieldId')
        });
      }
    });
    conversion.for('editingDowncast').elementToElement({
      model: 'signerName',
      view: (modelElement, { writer: viewWriter }) => {
        // Note: You use a more specialized createEditableElement() method here.
        const p = viewWriter.createEditableElement('p', {
          class: 'signer-name',
          smartfieldId: modelElement.getAttribute('smartfieldId')
        });

        return toWidgetEditable(p, viewWriter);
      }
    });
  }
}
