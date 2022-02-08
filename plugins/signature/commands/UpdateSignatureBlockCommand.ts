import { Command } from '@ckeditor/ckeditor5-core';
import { createSignatureBlock } from '../transforms';

type UpdateSignatureBlockCommandParams = {
  blockId: string;
  signingPartySmartfield: Record<string, string>; // Must be a smartfield
  signerSmartfield: Record<string, string>;
};

export default class UpdateSignatureBlockCommand extends Command {
  static eventId = 'update-signature-block';

  execute(params: UpdateSignatureBlockCommandParams): void {
    this.editor.model.change((writer) => {
      const docRoot = this.editor.model.document.getRoot();
      const range = this.editor.model.createRangeIn(docRoot);

      const signatureBlocks = [];
      // Iterate over all items in this range:
      for (const value of range.getWalker()) {
        switch (value.type) {
          case 'elementStart':
            if (
              value.item.name === 'signatureBlock' &&
              value.item.getAttribute('blockId') === params.blockId
            ) {
              signatureBlocks.push(value.item);
            }
        }
      }

      const updatedBlock = createSignatureBlock(writer, params);
      for (const match of signatureBlocks) {
        const itemStart = this.editor.model.createSelection(match, 'before');
        const itemSelection = this.editor.model.createSelection(match, 'on');
        this.editor.model.deleteContent(itemSelection);

        this.editor.model.insertContent(updatedBlock), itemStart;
      }
    });
  }
}
