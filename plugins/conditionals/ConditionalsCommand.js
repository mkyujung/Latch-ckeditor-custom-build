import Command from '@ckeditor/ckeditor5-core/src/command';

const CONDITIONAL = 'conditional'

export default class ConditionalsCommand extends Command {
  static eventId = 'conditionals-command';

  refresh() {
    const model = this.editor.model;
    const doc = model.document;

    this.value = doc.selection.getAttribute(CONDITIONAL);
    this.isEnabled = model.schema.checkAttributeInSelection(
      doc.selection,
      CONDITIONAL
    );
  }

  execute(params) {
    const { editor } = this;
    const { model } = editor;
    const { document } = model;
    const { selection } = document;

    model.change((writer) => {
      console.log(selection.isCollapsed ? 'COLLAPSED' : 'NOT COLLAPSED');
      if (selection.isCollapsed) {

        if(selection.hasAttribute(CONDITIONAL)){
          writer.removeSelectionAttribute(CONDITIONAL)
        } else {
          writer.setSelectionAttribute(CONDITIONAL, true);
        }
      } else {

        // complains about generator being passed
        // although works fine
        // @ts-ignore
        const ranges = model.schema.getValidRanges(selection.getRanges(),
        CONDITIONAL
        );

        for (const range of ranges) {
          if(selection.hasAttribute(CONDITIONAL)){
            writer.removeAttribute(CONDITIONAL, range)
          } else {
            writer.setAttribute(CONDITIONAL, true, range);
          }
        }
      }
    });
  }
}
