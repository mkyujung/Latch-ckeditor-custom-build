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

  execute() {
    const { editor } = this;
    const { model } = editor;

    const smartfields = getSmartfieldElementsInDocument(editor);

    const smartfieldElementsArray = Array.from(smartfields);

    console.log('???', smartfieldElementsArray);
    const conditionals = this.getAllConditionalElementsInDoc();

    conditionals.forEach((conditional) => {
      const linkedSmartfieldId = conditional.getAttribute('smartfield-id');
      const linkedSmartfieldElement = smartfieldElementsArray.find(
        (smartfield) => smartfield.getAttribute('id') === linkedSmartfieldId
      );

      if (!linkedSmartfieldElement) {
        return;
      }

      console.log('linked', linkedSmartfieldElement);

      const action = conditional.getAttribute('action');
      const condition = conditional.getAttribute('condition');
      const conditionalValue = conditional.getAttribute('value');
      const smartfieldValue = linkedSmartfieldElement.getAttribute('value');

      let result = false;
      if (condition === 'equals') {
        result = conditionalValue === smartfieldValue;
      } else {
        result = conditionalValue !== smartfieldValue;
      }

      model.change((writer) => {
        if (result) {
          writer.setAttribute('is-met', 'true', conditional);
        } else {
          if (conditional.hasAttribute('is-met')) {
            writer.removeAttribute('is-met', conditional);
          }
        }
      });
    });

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

  getAllConditionalElementsInDoc() {
    const { editor } = this;
    const docRoot = editor.model.document.getRoot();
    const range = editor.model.createRangeIn(docRoot);

    const conditionals = [];
    for (const value of range.getWalker()) {
      if (value.type === 'elementStart' && value.item.name === 'conditional') {
        conditionals.push(value.item);
      }
    }

    return conditionals;
  }
}
