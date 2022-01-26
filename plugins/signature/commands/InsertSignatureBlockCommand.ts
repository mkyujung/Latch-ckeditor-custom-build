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

      this.editor.model.insertContent(signatureBlock);
      writer.setSelection(signatureBlock, 'on');
      if (signatureBlock.nextSibling === null) {
        const p = writer.createElement('paragraph');
        writer.insert(p, signatureBlock, 'after');
      }
    });
  }

  refresh(): void {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      'signatureBlock'
    );

    this.isEnabled = allowedIn !== null;
  }
}
