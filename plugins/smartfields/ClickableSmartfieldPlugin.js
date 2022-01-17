import { Plugin } from '@ckeditor/ckeditor5-core';
import SmartfieldEditing from './SmartfieldEditing';

export default class ClickableSmartfieldPlugin extends Plugin {
  static get requires() {
    return [SmartfieldEditing];
  }
}
