import { Element } from '@ckeditor/ckeditor5-engine';
import Writer from '@ckeditor/ckeditor5-engine/src/model/writer';

export function createSignatureBlock(
  writer: Writer,
  params: {
    blockId: string;
    signingPartySmartfield: Record<string, string>; // Must be a smartfield
    signerSmartfield: Record<string, string>;
  }
): Element {
  const { blockId, signingPartySmartfield, signerSmartfield } = params;

  const signatureBlock = writer.createElement('signatureBlock', { blockId });
  const signingPartyElement = writer.createElement('signingParty', {
    smartfieldId: signingPartySmartfield.id
  });
  const signingPartySmartfieldElement = writer.createElement(
    'smartfield',
    signingPartySmartfield
  );
  const signatureField = writer.createElement('signatureField');
  const signerNameElement = writer.createElement('signerName', {
    smartfieldId: signerSmartfield.id
  });

  const signerSmartfieldElement = writer.createElement(
    'smartfield',
    signerSmartfield
  );

  writer.append(signingPartyElement, signatureBlock);
  writer.append(signatureField, signatureBlock);
  writer.append(signerNameElement, signatureBlock);

  writer.append(signingPartySmartfieldElement, signingPartyElement);
  writer.append(signerSmartfieldElement, signerNameElement);

  return signatureBlock;
}
