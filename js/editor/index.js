import { Editor } from './Editor';
import { renderSidebar } from './Sidebar';

const canvas = document.getElementById('screen');
const editor = new Editor(canvas);

const sidebarSelector = document.querySelector('.sidebar');
renderSidebar(sidebarSelector, editor);