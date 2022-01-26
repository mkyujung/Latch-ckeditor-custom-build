import { Command } from '@ckeditor/ckeditor5-core';
import { createSignatureBlock } from '../transforms';

type InsertSignatureBlockCommandParams = {
  blockId: string;
  signingPartySmartfield: Record<string, string>; // Must be a smartfield
  signerSmartfield: Record<string, string>;
};

export default class InsertSignatureBlockCommand extends Command {
  static eventId = 'insert-signature-block';

  execute(params: InsertSignatureBlockCommandParams): void {
    this.editor.model.change((writer) => {
      const signatureBlock = createSignatureBlock(writer, params);
      writer.appendElement('paragraph', signatureBlock);
      this.editor.model.document.selection;
      console.log(
        '🚀 ~ file: InsertSignatureBlockCommand.ts ~ line 18 ~ InsertSignatureBlockCommand ~ this.editor.model.change ~ this.editor.model.document.selection ',
        this.editor.model.document.selection
      );
      const endSelection = this.editor.model.createSelection(
        this.editor.model.document.getRoot(),
        'end'
      );
      console.log(
        '🚀 ~ file: InsertSignatureBlockCommand.ts ~ line 26 ~ InsertSignatureBlockCommand ~ this.editor.model.change ~ endSelection',
        endSelection
      );
      this.editor.model.insertContent(
        signatureBlock,
        // this.editor.model.document.selection || endSelection
        endSelection
      );
      writer.setSelection(signatureBlock, 'on');
    });
  }
}
