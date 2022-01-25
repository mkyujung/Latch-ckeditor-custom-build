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

      this.editor.model.insertContent(signatureBlock);
      writer.setSelection(signatureBlock, 'on');
    });
  }
}
