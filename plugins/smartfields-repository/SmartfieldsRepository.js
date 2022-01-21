import {
  RefreshSmartfieldsListCommand,
  UpdateSmartfieldCommand
} from './commands';

import { isSmartfield } from '../../utils';
import mix from '@ckeditor/ckeditor5-utils/src/mix';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class SmartfieldsRepository extends Plugin {
  static get pluginName() {
    return 'SmartfieldsRepository';
  }

  constructor(editor) {
    super(editor);
    this.bind('smartfields');
  }

  init() {
    const { editor } = this;

    // I don't know what this does, guess it initializes default config?
    editor.config.define('smartfieldProps', {
      initialSmartfields: []
    });

    const initial =
      editor.config.get('smartfieldProps.initialSmartfields') || [];

    this.set('smartfields', initial);

    // Register commands
    this.editor.commands.add(
      RefreshSmartfieldsListCommand.eventId,
      new RefreshSmartfieldsListCommand(this.editor)
    );

    this.editor.commands.add(
      UpdateSmartfieldCommand.eventId,
      new UpdateSmartfieldCommand(this.editor)
    );

    // Handlers
    this.editor.on(
      RefreshSmartfieldsListCommand.eventId,
      this._handleRefreshSmartfieldList.bind(this)
    );

    // Observable change
    // this.on('change:smartfields', (evt, propertyName, newValue, oldValue) => {
    //   console.log(
    //     `#${propertyName} has changed from "${oldValue}" to "${newValue}"`
    //   );
    // });
  }

  _handleRefreshSmartfieldList(event, params) {
    this.set('smartfields', [...params]);
    this._updateModel(params);
  }

  // This updates the backing CKeditor model with refreshed smartfields
  _updateModel(smartfieldsList) {
    const docRoot = this.editor.model.document.getRoot();
    const range = this.editor.model.createRangeIn(docRoot);

    const matchedSmartfields = [];
    // Iterate over all items in this range:
    for (const value of range.getWalker()) {
      switch (value.type) {
        case 'elementStart':
          if (isSmartfield(value.item)) {
            const smartfield = smartfieldsList.find(
              (s) => s.id === value.item.getAttribute('id')
            );
            if (smartfield) {
              matchedSmartfields.push([value.item, smartfield]);
            }
          }
      }
    }

    for (const [match, smartfield] of matchedSmartfields) {
      this.editor.model.change((writer) => {
        const itemStart = this.editor.model.createSelection(match, 'before');
        const itemSelection = this.editor.model.createSelection(match, 'on');

        this.editor.model.deleteContent(itemSelection);
        this.editor.model.insertContent(
          writer.createElement('smartfield', smartfield),
          itemStart,
          'after'
        );
      });
    }
  }
}

mix(SmartfieldsRepository, ObservableMixin);

export default SmartfieldsRepository;
