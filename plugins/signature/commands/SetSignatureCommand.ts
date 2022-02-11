import { Command } from '@ckeditor/ckeditor5-core';

type SetSignatureCommandParams = {
  wrapperElement: HTMLElement;
  url: string;
};

export default class SetSignatureCommand extends Command {
  static eventId = 'set-signature';
  isEnabled = true;

  init(): void {
    this.set('isEnabled', true);
  }

  execute({ wrapperElement, url }: SetSignatureCommandParams): void {
    this.editor.model.change((writer) => {
      // Reverse map from the DOM back to the model to update the signature url
      const viewNode =
        this.editor.editing.view.domConverter.domToView(wrapperElement).parent;

      if (!viewNode.is('view:element')) {
        return;
      }

      const modelItem = this.editor.editing.mapper.toModelElement(viewNode);

      if (modelItem.is('model:element', 'signatureField')) {
        // writer.setAttribute('signature', url, modelItem); // updating an attribute doesn't re-render the editor for some reason

        // Replace entire signing field
        const itemStart = this.editor.model.createSelection(
          modelItem,
          'before'
        );
        const itemSelection = this.editor.model.createSelection(
          modelItem,
          'on'
        );
        this.editor.model.deleteContent(itemSelection);

        this.editor.model.insertContent(
          writer.createElement('signatureField', {
            blockId: modelItem.getAttribute('blockId'),
            signature: url,
            signerSmartfieldId: modelItem.getAttribute('signerSmartfieldId')
          }),
          itemStart
        );
      } else {
        console.error(
          'Signing block structure does not match expected. Check the render structure of signature fields in SignatureBlock.ts'
        );
      }
    });
  }
}
