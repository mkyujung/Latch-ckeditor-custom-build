import Plugin from '@ckeditor/ckeditor5-core/src/plugin';


import ConditionalsEditing from './ConditionalsEditing';
import ConditionalsToolbar from './ConditionalsToolbar';

export default class ConditionalsPlugin extends Plugin {

  static get requires() {
    return [ConditionalsEditing, ConditionalsToolbar];
  }

}
