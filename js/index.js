import { GameManager } from './GameManager';

const canvas = document.getElementById('screen'); 
const context = canvas.getContext('2d');
const game = new GameManager(context);
