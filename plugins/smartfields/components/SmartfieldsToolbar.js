// Consider changing styling to event driven plugin
// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/conversion/conversion-extending-output.html
// So the plugin can be removed for pdf renders
import {
  addListToDropdown,
  createDropdown,
  Model
} from '@ckeditor/ckeditor5-ui';

import { Collection } from '@ckeditor/ckeditor5-utils';
import InsertSmartfieldCommand from '../commands/InsertSmartfieldCommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SmartfieldsRepository from '../../smartfields-repository/SmartfieldsRepository';

export default class SmartfielsToolbar extends Plugin {
  static get requires() {
    return [SmartfieldsRepository];
  }

  init() {
    const { editor } = this;
    const { t } = editor;
    const initialSmartfields =
      editor.config.get('smartfieldProps.initialSmartfields') || [];
    const repository = editor.plugins.get(SmartfieldsRepository.pluginName);

    repository.on(
      'change:smartfields',
      (evt, propertyName, newValue, oldValue) => {
        this._handleSmartfieldsChanged.call(this, newValue);
      }
    );

    editor.ui.componentFactory.add('smartfield', (locale) => {
      this.dropdownRef = createDropdown(locale);

      // Because this is only set on init, it's not getting any new values
      addListToDropdown(
        this.dropdownRef,
        getDropdownItemsDefinitions(initialSmartfields)
      );

      this.dropdownRef.buttonView.set({
        label: t('Smartfield'),
        tooltip: true,
        withText: true
      });

      this.listenTo(this.dropdownRef, 'execute', (evt) => {
        editor.execute(
          InsertSmartfieldCommand.eventId,
          evt.source.commandParam
        );

        editor.editing.view.focus();
      });

      return this.dropdownRef;
    });
  }

  _handleSmartfieldsChanged(smartfields) {
    console.log(
      '🚀 ~ file: SmartfieldsToolbar.js ~ line 63 ~ SmartfielsToolbar ~ _handleSmartfieldsChanged ~ smartfields',
      smartfields
    );
    if (this.dropdownRef) {
      // Remove existing dropdown
      this.dropdownRef.panelView.children.clear();

      addListToDropdown(
        this.dropdownRef,
        getDropdownItemsDefinitions(smartfields)
      );
    }
  }
}

function getDropdownItemsDefinitions(smartfields) {
  const itemDefinitions = new Collection(
    smartfields.map((s) => ({
      type: 'button',
      model: new Model({
        commandParam: s,
        label: s.title,
        withText: true
      })
    }))
  );

  return itemDefinitions;
}
