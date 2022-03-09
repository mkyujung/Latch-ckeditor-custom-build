import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ConditionalsRepository extends Plugin {
  static get pluginName() {
    return 'ConditionalsRepository';
  }

  constructor(editor) {
    super(editor);
    this.bind('conditionals');
  }

  init() {
    const { editor } = this;

    editor.config.define('conditionalProps', {
      initialConditionals: []
    });

    const initial =
      editor.config.get('conditionalProps.initialConditionals') || [];

    this.set("conditionals", initial)
  }
}
