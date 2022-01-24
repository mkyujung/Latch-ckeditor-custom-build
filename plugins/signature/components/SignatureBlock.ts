import { ContextPlugin, Plugin } from '@ckeditor/ckeditor5-core';

import SmartfieldsRepository from '../../smartfields-repository/SmartfieldsRepository';

export default class SignatureBlock extends Plugin {
  static get requires(): Array<typeof Plugin | typeof ContextPlugin | string> {
    return [SmartfieldsRepository];
  }

  init(): void {
    const { editor } = this;
    const { t } = editor;

    this._defineConverters();
    this._defineSchema();
  }

  _defineSchema(): void {
    const { schema } = this.editor.model;

    schema.register('signatureBlock', {
      allowWhere: '$block',
      isObject: true,
      allowAttributes: [],
      allowContentOf: '$block'
    });

    schema.register('signingParty', {
      allowIn: 'signatureBlock',
      allowContentOf: '$block',
      isLimit: true
    });

    schema.register('signatureField', {
      isLimit: true,
      allowIn: 'signatureBlock',
      allowContentOf: '$block'
    });

    schema.register('signatureName', {
      isLimit: true,
      allowIn: 'signatureBlock',
      allowContentOf: '$block'
    });
  }

  _defineConverters(): void {
    const { conversion } = this.editor;

    conversion.elementToElement({
      model: 'signatureBlock',
      view: {
        name: 'div',
        classes: 'signature-block'
      }
    });

    conversion.elementToElement({
      model: 'signingParty',
      view: {
        name: 'div',
        classes: 'signing-party'
      }
    });

    conversion.elementToElement({
      model: 'signatureField',
      view: {
        name: 'div',
        classes: 'signature-field'
      }
    });

    conversion.elementToElement({
      model: 'signerName',
      view: {
        name: 'div',
        classes: 'signer-name'
      }
    });
  }
}
