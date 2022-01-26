import './SignatureBlock.css';

import { ContextPlugin, Plugin } from '@ckeditor/ckeditor5-core';
import {
  toWidget,
  toWidgetEditable,
  viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget';

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

    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
        viewElement.hasClass('signatureBlock')
      )
    );

    editor.commands.add(
      UpdateSignatureBlockCommand.eventId,
      new UpdateSignatureBlockCommand(editor)
    );
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
      allowAttributes: ['signature'],
      allowChildren: ['$text']
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
    const { conversion } = this.editor;

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
          signature: viewElement.getAttribute('signature') || ''
        });
      },
      view: {
        name: 'button',
        classes: 'signature-field'
      }
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'signatureField',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        const button = viewWriter.createContainerElement('button', {
          class: 'signature-field',
          signature: modelItem.getAttribute('signature')
        });

        return button;
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'signatureField',
      view: (modelItem, writer) => {
        const viewWriter = writer.writer;
        const button = viewWriter.createContainerElement('button', {
          class: 'signature-field'
        });
        const { smartfields } = this.editor.plugins.get(
          'SmartfieldsRepository'
        );

        // Signature image
        const signatureUrl = modelItem.getAttribute('signature');
        if (signatureUrl) {
          const image = viewWriter.createRawElement('img', {
            src: signatureUrl
          });
          viewWriter.insert(viewWriter.createPositionAt(button, 0), image);
        } else {
          const smartfieldId =
            modelItem.nextSibling.is('element') &&
            modelItem.nextSibling.getAttribute('smartfieldId');

          const signer = smartfields.find((s) => s.id === smartfieldId);

          const buttonText = viewWriter.createText(
            `${signer.value || signer.defaultValue || signer.title}'s signature`
          );
          viewWriter.insert(viewWriter.createPositionAt(button, 0), buttonText);
        }
        return button;
      }
    });
    // conversion.elementToElement({
    //   model: 'signatureField',
    //   view: {
    //     name: 'button',
    //     classes: 'signature-field'
    //   }
    // });

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
