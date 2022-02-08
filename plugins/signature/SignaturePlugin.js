import { Plugin } from '@ckeditor/ckeditor5-core';
import SignatureBlock from './components/SignatureBlock';

export default class SignaturePlugin extends Plugin {
  static get pluginName() {
    return 'Signature';
  }

  static get requires() {
    return [SignatureBlock];
  }
}
