/**
 * @license Copyright (c) 2014-2022, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js'
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js'
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink.js'
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js'
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter.js'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js'
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices.js'
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js'
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js'
import Comments from '@ckeditor/ckeditor5-comments/src/comments.js'
import ContextBase from '@ckeditor/ckeditor5-core/src/context'
import ContextWatchdog from '@ckeditor/ckeditor5-watchdog/src/contextwatchdog'
import DataFilter from '@ckeditor/ckeditor5-html-support/src/datafilter.js'
import DataSchema from '@ckeditor/ckeditor5-html-support/src/dataschema.js'
import DecoupledDocumentEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor.js'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js'
import ExportPdf from '@ckeditor/ckeditor5-export-pdf/src/exportpdf.js'
import ExportWord from '@ckeditor/ckeditor5-export-word/src/exportword.js'
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace.js'
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js'
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js'
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js'
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport.js'
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight.js'
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js'
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed.js'
import Image from '@ckeditor/ckeditor5-image/src/image.js'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js'
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js'
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js'
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock.js'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js'
import Link from '@ckeditor/ckeditor5-link/src/link.js'
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage.js'
import List from '@ckeditor/ckeditor5-list/src/list.js'
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle.js'
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown.js'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js'
import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js'
import Mention from '@ckeditor/ckeditor5-mention/src/mention.js'
import NarrowSidebar from '@ckeditor/ckeditor5-comments/src/annotations/narrowsidebar'
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak.js'
import Pagination from '@ckeditor/ckeditor5-pagination/src/pagination.js'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin.js'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js'
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters.js'
import SpecialCharactersArrows from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows.js'
import SpecialCharactersCurrency from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency.js'
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js'
import SpecialCharactersLatin from '@ckeditor/ckeditor5-special-characters/src/specialcharacterslatin.js'
import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical.js'
import SpecialCharactersText from '@ckeditor/ckeditor5-special-characters/src/specialcharacterstext.js'
import StandardEditingMode from '@ckeditor/ckeditor5-restricted-editing/src/standardeditingmode.js'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js'
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript.js'
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript.js'
import Table from '@ckeditor/ckeditor5-table/src/table.js'
import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption.js'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js'
import TextPartLanguage from '@ckeditor/ckeditor5-language/src/textpartlanguage.js'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js'
import TodoList from '@ckeditor/ckeditor5-list/src/todolist'
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js'
import WideSidebar from '@ckeditor/ckeditor5-comments/src/annotations/widesidebar'
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js'

class Context extends ContextBase {}
// An example of a plugin that provides user data for an editor
// that uses `Comments` and `RevisionHistory` plugins.
export class UsersIntegration extends Plugin {
  static get requires() {
    return ['Comments']
  }

  init() {
    const users = this.editor.plugins.get('Users')

    // Provide user data from your database.
    users.addUser({
      id: 'u1',
      name: 'Kate Smith'
    })

    users.addUser({
      id: 'u2',
      name: 'Joe Doe'
    })

    // Define the local user.
    users.defineMe('u1')
  }
}

// Plugins to include in the context.
Context.builtinPlugins = [NarrowSidebar, WideSidebar]

Context.defaultConfig = {
  // Configuration shared between editors:
  language: 'en'
}

class Editor extends DecoupledDocumentEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  CloudServices,
  Code,
  CodeBlock,
  Comments,
  DataFilter,
  DataSchema,
  Essentials,
  ExportPdf,
  ExportWord,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListStyle,
  Markdown,
  MediaEmbed,
  MediaEmbedToolbar,
  Mention,
  PageBreak,
  Pagination,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  StandardEditingMode,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  TodoList,
  TrackChanges,
  Underline,
  WordCount
]

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'fontSize',
      'fontFamily',
      '|',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'alignment',
      '|',
      'numberedList',
      'bulletedList',
      '|',
      'outdent',
      'indent',
      '|',
      'todoList',
      'link',
      'blockQuote',
      'imageUpload',
      'insertTable',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
      'comment',
      'exportPdf',
      'exportWord',
      'findAndReplace',
      'highlight',
      'horizontalLine',
      'imageInsert',
      'pageNavigation',
      'pageBreak',
      'removeFormat',
      'specialCharacters',
      'restrictedEditingException',
      'subscript',
      'superscript'
    ]
  },
  language: 'en',
  image: {
    toolbar: [
      'comment',
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      'linkImage'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ],
    tableToolbar: ['comment']
  },
  pagination: {
    pageWidth: '21cm',
    pageHeight: '29.7cm',
    pageMargins: {
      top: '20mm',
      bottom: '20mm',
      left: '12mm',
      right: '12mm'
    }
  },
  licenseKey: process.env.CKEDITOR_LICENSE_KEY
}

const CkModule = { Editor, Context, ContextWatchdog }
export default CkModule
