import { Command } from '@ckeditor/ckeditor5-core';
import Writer from '@ckeditor/ckeditor5-engine/src/model/writer';

type InsertSignatureBlockCommandParams = {
  blockId: string;
  signingPartySmartfield: Record<string, string>; // Must be a smartfield
  signerSmartfield: Record<string, string>;
};

export default class InsertSignatureBlockCommand extends Command {
  static eventId = 'insert-signature-block';

  execute(params: InsertSignatureBlockCommandParams): void {
    console.log('IM EXECUTING');

    this.editor.model.change((writer) => {
      const signatureBlock = createSignatureBlock(writer, params);
      this.editor.model.insertContent(signatureBlock);
      writer.setSelection(signatureBlock, 'on');
    });
  }
}

function createSignatureBlock(
  writer: Writer,
  params: InsertSignatureBlockCommandParams
) {
  const { blockId, signingPartySmartfield, signerSmartfield } = params;

  const signatureBlock = writer.createElement('signatureBlock', { blockId });
  const signingParty = writer.createElement('signingParty', {
    smartfieldId: signingPartySmartfield.id
  });
  const signingPartySmartfieldElement = writer.createElement(
    'smartfield',
    signingPartySmartfield
  );
  const signatureField = writer.createElement('signatureField');
  const signerNameElement = writer.createElement('signerName', {
    smartfieldId: signingPartySmartfield.id
  });

  const signerNameText = writer.createText(
    `${
      signerSmartfield.value ||
      signerSmartfield.defaultValue ||
      signerSmartfield.title
    }'s signature`
  );
  writer.append(signerNameText, signatureField);
  const signerSmartfieldElement = writer.createElement(
    'smartfield',
    signerSmartfield
  );

  writer.append(signingParty, signatureBlock);
  writer.append(signatureField, signatureBlock);
  writer.append(signerNameElement, signatureBlock);

  writer.append(signingPartySmartfieldElement, signingParty);
  writer.append(signerSmartfieldElement, signerNameElement);

  writer.appendElement('paragraph', signatureBlock);
  return signatureBlock;
}
