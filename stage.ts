declare const graph: HTMLDivElement

import {applyLetterbox} from './letterbox'
import ForceGraph3D from '3d-force-graph'

let w: any = window;
w.ForceGraph3D = ForceGraph3D;

import miserables from './miserables.json'
w.miserables = miserables

import blocks from './blocks.json'
w.blocks = blocks;

import * as THREE from 'three'
w.THREE = THREE
import SpriteText from 'three-spritetext'

import {purple, yellow, silver, blue, green, indigo, black} from './colors'

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'


const Graph = ForceGraph3D({ controlType: 'orbit' })(graph)
  .forceEngine('ngraph')
  .linkCurvature((link: any) => (link.curve || 0) * 0.2)
  // .ngraphPhysics({
  //   springLength: 10,
  //   springCoeff: 0.0008,
  //   gravity: -1.2,
  //   theta: 0.8,
  //   dragCoeff: 0.02,
  //   timeStep: 20
  // })
  .nodeThreeObject((node: any) => {
    // use a sphere as a drag handle
    const obj = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
    );

    // add text sprite as child
    const sprite = new SpriteText(node.name);
    sprite.fontFace = 'Source Sans Pro';
    sprite.fontWeight = '600'
    sprite.padding = 1
    sprite.backgroundColor = black.darker.a(0.2).toString();
    if (node.isEntryPoint) {
      sprite.color = blue.light.toString()
      sprite.textHeight = 2
    } else if (node.isField) {
      sprite.color = (node.isScalar ? indigo.light : yellow.light).toString()
      sprite.textHeight = 2
      sprite.fontWeight = '700'
    } else {
      sprite.color = yellow.base.toString()
      sprite.textHeight = 8
    }
    obj.add(sprite)
    
    return obj;
  })
  .linkColor(silver.light.toString())
  // .linkThreeObjectExtend(true)
  // .linkThreeObject((link: any) => {
  //   // extend link with text sprite
  //   const sprite = new SpriteText(link.name);
  //   sprite.color = 'lightgrey';
  //   sprite.fontFace = 'Source Sans Pro';
  //   sprite.textHeight = 2;
  //   return sprite;
  // })
  // .linkPositionUpdate((sprite, { start, end }) => {
  //   const middlePos = Object.assign({}, ...['x', 'y', 'z'].map(c => ({
  //     [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
  //   })));

  //   // Position sprite
  //   Object.assign(sprite.position, middlePos);

  //   return true;
  // })
  .showNavInfo(false)
  .linkDirectionalArrowLength(2)
  .linkDirectionalArrowRelPos(0.5)
  .linkDirectionalParticles(10)
  .linkDirectionalParticleSpeed(0.001) 


const bloomPass = new UnrealBloomPass();
bloomPass.strength = 2;
bloomPass.radius = 1;
bloomPass.threshold = 0.1;
// Graph.postProcessingComposer().addPass(bloomPass);

const SLOW = 1 / 8e3

export function spin(distance = 300, lookAt = undefined, speed = SLOW) {
  return t => {
    let angle = t * speed
    Graph.cameraPosition({
      x: distance * Math.sin(angle),
      y: distance * Math.cos(angle),
    }, lookAt)
  }
}



w.spin = spin
  
Graph.onNodeClick(console.log)
// Graph.d3Force('charge')(10)
Graph.d3Force('link')(1)
// Graph.d3Force('center')(5)

w.Graph = Graph
applyLetterbox([16, 9], box => { Graph.width(box.width); Graph.height(box.height) });
