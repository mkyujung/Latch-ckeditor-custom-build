import { Command } from '@ckeditor/ckeditor5-core';

type RemoveSignatureBlockCommandParams = {
  blockId: string;
};

export default class RemoveSignatureBlockCommand extends Command {
  static eventId = 'remove-signature-block';

  execute({ blockId }: RemoveSignatureBlockCommandParams): void {
    const docRoot = this.editor.model.document.getRoot();
    const range = this.editor.model.createRangeIn(docRoot);

    const signatureBlocks = [];
    for (const value of range.getWalker()) {
      switch (value.type) {
        case 'elementStart':
          if (
            value.item.getAttribute('blockId') === blockId &&
            value.item.name === 'signatureBlock'
          ) {
            signatureBlocks.push(value.item);
          }
      }
    }
    this.editor.model.change((writer) => {
      signatureBlocks.forEach((block) => {
        writer.remove(block);
        // writer.appendElement('paragraph', docRoot);
      });
    });
  }
}
