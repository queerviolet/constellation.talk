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
    link?: any
    three?: THREE.Object3D
    sprite?: SpriteTextExt
  }
} = {}

type SpriteTextExt = SpriteText & {
  baseColor?: RGBA
  baseTextHeight?: number
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
    sprite.material.depthWrite = false
    sprite.material.blending = THREE.AdditiveBlending

    let color
    if (node.isRoot) {
      color = palette.lightest
      sprite.baseTextHeight = sprite.textHeight = 12
    } else if (node.isField) {
      color = node.isScalar ? palette.dark : palette.base
      sprite.baseTextHeight = sprite.textHeight = 8      
      sprite.fontWeight = '700'
    } else {
      color = palette.light
      sprite.baseTextHeight = sprite.textHeight = 10
    }
    sprite.color = color.a(1).toString()
    sprite.baseColor = color

    obj.add(sprite)    
    Atlas[node.id].three = obj
    Atlas[node.id].sprite = sprite
    return obj
  })
  .linkWidth(link =>
    Graph.highlighted?.has(link.id)
      ? 5
      : 0.5
  )
  .linkColor(blue.light.toString())  
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
  if (!this.highlighted) {
    for (const id in Atlas) {
      const sprite = Atlas[id].sprite
      if (!sprite) continue
      sprite.color = sprite.baseColor.a(1).toString()
    }
    return
  }
  for (const id in Atlas) {
    const sprite = Atlas[id].sprite
    if (!sprite) continue
    sprite.color = this.highlighted.has(id)
      ? sprite.baseColor.a(1).toString()
      : sprite.baseColor.a(0.2).toString()
  }      
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
    setTextSizeForDistance(this.camera().position.length())
    --this.isAutoZooming
  }, args[0])
  return this
}

function setTextSizeForDistance(distance=300) {
  for (const id in Atlas) {
    const {sprite} = Atlas[id]
    if (!sprite) continue
    sprite.textHeight = Math.max(sprite.baseTextHeight, sprite.baseTextHeight * distance / 600)
  }
}

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
