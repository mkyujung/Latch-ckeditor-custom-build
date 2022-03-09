import Command from '@ckeditor/ckeditor5-core/src/command';
import { getSmartfieldElementsInDocument } from '../smartfields-repository/queries';

const CONDITIONAL = 'conditional';

export default class ConditionalsRefreshCommand extends Command {
  static eventId = 'conditionals-refresh-command';

  // refresh() {
  //   const model = this.editor.model;
  //   const doc = model.document;

  //   console.log('REFRESHE!!!!!!!');

  //   this.value = doc.selection.getAttribute(CONDITIONAL);
  //   this.isEnabled = model.schema.checkAttributeInSelection(
  //     doc.selection,
  //     CONDITIONAL
  //   );
  // }

  execute(params) {
    const { editor } = this;
    const { model } = editor;

    const smartfields = getSmartfieldElementsInDocument(editor);

    console.log('ref params', params);


    // go through each condition and
    // check if needed smartfields condition is met
  }

  // checkCondition(smartfields, conditionalParams) {
  //   for (const smartfield of smartfields) {
  //     const id = smartfield.getAttribute('id');
  //     if (id === conditionalParams.smartfieldId) {
  //       const value = smartfield.getAttribute('value');
  //       if (value === conditionalParams.value) {
  //         return true;
  //       }
  //     }
  //   }

  //   return false;
  // }

  checkConditionsMet() {
    const conditionals = this.getAllConditionsInDoc()
    console.log("conditions", conditionals)
  }

  getAllConditionsInDoc() {
    const { editor } = this;
    const docRoot = editor.model.document.getRoot();
    const range = editor.model.createRangeIn(docRoot);

    const conditionals = [];
    for (const value of range.getWalker()) {
      if (
        value.type === 'elementStart' &&
        value.item.hasAttribute('conditional')
      ) {
        conditionals.push(value.item);
      }
    }

    return conditionals
  }
}
