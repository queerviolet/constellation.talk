declare const graph: HTMLDivElement

import {applyLetterbox} from './letterbox'
import ForceGraph3D from '3d-force-graph'

let w: any = window;
w.ForceGraph3D = ForceGraph3D;

import miserables from './miserables.json'
w.miserables = miserables

import blocks from './blocks.json'
w.blocks = blocks;

const Graph = ForceGraph3D()(graph)
w.Graph = Graph
applyLetterbox(16 / 9, box => { Graph.width(box.width); Graph.height(box.height) });
