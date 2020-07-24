declare const graph: HTMLDivElement

import {applyLetterbox} from './letterbox'
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph'

import * as THREE from 'three'
import SpriteText from 'three-spritetext'

import {purple, yellow, red, silver, blue, green, indigo, black, RGBA} from './colors'

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { sleep } from './time';

type ForceGraph3D = ForceGraph3DInstance & {
  isAutoZooming?: number,
  highlighted?: Set<string>
  highlight?(id: string): ForceGraph3D
  lowlight?(id: string): ForceGraph3D
  clearHighlights?(): ForceGraph3D
  recenter?(): ForceGraph3D
  updateHighlight?(): ForceGraph3D
}

export const Graph: ForceGraph3D = ForceGraph3D({ controlType: 'orbit' })(graph)

Graph.renderer().setPixelRatio(window.devicePixelRatio)

const graphColors = {
  spacey: red,
  bookish: blue,
  earthseed: purple,
}

export const Atlas: {
  [id: string]: {
    node?: any
    three?: THREE.Object3D
  }
} = {}

type SpriteTextExt = SpriteText & {
  baseColor?: RGBA
}

Graph
  .forceEngine('d3')
  .numDimensions(3)  
  .nodeThreeObject((node: any) => {
    const graph = node.graph || 'default'
    const palette
     = graphColors[graph] || yellow

    // use a sphere as a drag handle
    const obj = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
    );

    // add text sprite as child
    const sprite: SpriteTextExt = new SpriteText(node.name);
    sprite.fontFace = 'Source Sans Pro';
    sprite.fontWeight = '600'
    sprite.padding = 1

    let color
    if (node.isRoot) {
      color = palette.lightest
      sprite.textHeight = 12
    } else if (node.isField) {
      color = node.isScalar ? palette.dark : palette.base
      sprite.textHeight = 8
      sprite.fontWeight = '700'
    } else {
      color = palette.light
      sprite.textHeight = 10
    }
    obj.onBeforeRender = () => {
      if (!Graph.highlighted) {
        sprite.color = color.a(1).toString()
        return
      }
      sprite.color = Graph.highlighted.has(node.id)
        ? color.a(1).toString()
        : color.a(0.2).toString()        
    }

    obj.add(sprite)    
    Atlas[node.id].three = obj;
    return obj
  })
  .linkColor(blue.light.toString())
  
  // .linkWidth(link => link.id === 'spacey.Query.missions:in' ? 5 : 1)
  // .linkOpacity(link => link.id === 'spacey.Query.missions:in' ? 1 : 0.2)
  // .nodeOpacity(node => node.id === 'spacey.Query.missions' ? 1 : 0.2)
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
  .linkDirectionalArrowLength(6)
  .linkDirectionalArrowRelPos(0.5)
  .linkDirectionalArrowColor('#ff00ff')
  .linkDirectionalParticleColor(blue.lightest.three as any)
  .linkDirectionalParticles((link: any) =>
    Graph.highlighted && Graph.highlighted.has(link.id)
      ? 10
      : 0
  )
  .linkDirectionalParticleWidth(1.5)
  .linkDirectionalParticleSpeed(0.005)
  .cameraPosition({ x: 0, y: 0, z: 500 })

Graph.updateHighlight = function() {
  this.linkDirectionalParticles(this.linkDirectionalParticles())
  return this
}

Graph.highlight = function(id: string) {  
  const hls = this.highlighted ? this.highlighted : (this.highlighted = new Set)
  hls.add(id)
  this.updateHighlight()
  return this
}

Graph.lowlight = function(id: string) {  
  if (!this.highlighted) return
  this.highlighted.delete(id)
  if (!this.highlighted.size) delete this.highlighted
  this.updateHighlight()
  return this
}

Graph.clearHighlights = function() {
  delete this.highlighted
  this.updateHighlight()
  return this
}

const bloomPass = new (UnrealBloomPass as any)();
bloomPass.strength = 1;
bloomPass.radius = 1;
bloomPass.threshold = 0.1;
Graph.postProcessingComposer().addPass(bloomPass);

const SLOW = 1

const Y = new THREE.Vector3(0, 1, 0)
export function orbit(speed = SLOW, axis = Y) {
  return t => {
    if (Graph.isAutoZooming) return
    let angle = t * speed
    let distance = Graph.camera().position.length()
    Graph.cameraPosition({
      x: distance * Math.sin(angle),
      z: distance * Math.cos(angle),
    })
  }
}


 
Graph.onNodeClick(console.log)
Graph.d3Force('charge')(-10)
Graph.d3Force('link').distance(link => link.id.endsWith(':fed') ? 300 : 30)
// Graph.d3Force('center')(5)

applyLetterbox([16, 9], box => { Graph.width(box.width); Graph.height(box.height) });

const ztf = Graph.zoomToFit
Graph.isAutoZooming = 0
Graph.zoomToFit = function(...args: Parameters<ForceGraph3DInstance["zoomToFit"]>) {
  ++this.isAutoZooming
  ztf.apply(this, args)
  setTimeout(() => {
    --this.isAutoZooming
  }, args[0])
  return this
}

// const gd = Graph.graphData
// Graph.graphData = function(...args: [] | Parameters<ForceGraph3DInstance["graphData"]>) {  
//   if (!args.length) return gd.apply(this) as any
//   setTimeout(() => this.zoomToFit(600), 1000)
//   return gd.apply(this, args)
// }

async function doRecenter(graph: ForceGraph3D, ms = 600) {
  graph.zoomToFit(ms)
  await sleep(1200)
  const dist = graph.camera().position.length()
  ++graph.isAutoZooming
  
  try {
    graph.cameraPosition({ x: 0, y: 0, z: dist }, { x: 0, y: 0, z: 0 }, 1000)
    await sleep(1000)
    graph.zoomToFit(ms)
    await sleep(1000)
  } finally {
    --graph.isAutoZooming
  }
}

Graph.recenter = function(ms = 600) {
  // setTimeout(() => {
  //   this.zoomToFit(ms)  
  //   setTimeout(() => {
  //     const dist = this.camera().position.length()
  //     ++this.isAutoZooming
  //     this.cameraPosition({ x: 0, y: 0, z: dist }, { x: 0, y: 0, z: 0 }, 1000)
  //     setTimeout(() => {
  //       --this.isAutoZooming
  //     }, 1000)
  //   }, ms)
  // }, 1500)
  doRecenter(this, ms)
  return this
}


Object.assign(window as any, {
  ForceGraph3D, THREE, orbit, Graph, Atlas
})
