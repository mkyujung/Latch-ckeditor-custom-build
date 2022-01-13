import { Command } from '@ckeditor/ckeditor5-core'

export default class InsertSmartfieldCommand extends Command {
  execute(commandParam) {
    this.editor.model.change((writer) => {
      const smartfield = writer.createElement('smartfield', {
        value: commandParam.value,
        title: commandParam.title
      })

      this.editor.model.insertContent(smartfield)

      writer.setSelection(smartfield, 'on')
    })
  }

  // This method runs on every change
  refresh() {
    const { model } = this.editor
    const { selection } = model.document

    const isAllowed = model.schema.checkChild(
      selection.focus.parent,
      'smartfield'
    )

    this.isEnabled = isAllowed
  }
}
