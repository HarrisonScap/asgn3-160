// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Vars
let canvas;
let gl;
let a_Position;
//let u_Size;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;


// Classes //


/*
                POINT
*/

class Point{
    constructor(){
        this.type = "point";
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
    }

    render() {
        var xy = this.position
        var rgba = this.color;
        var size = this.size;
        
        gl.disableVertexAttribArray(a_Position);
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size,size);

        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}


/*
                    TRIANGLES
*/


class Triangle{
    constructor(){
        this.type="triangle"
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

               // Pass the color of a point to u_FragColor variable
               gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
               // Pass the size of a point to u_Size variable
               gl.uniform1f(u_Size,size);
       
               // Draw
               var d = this.size/200.0
               drawTriangle( [xy[0]-d,xy[1],xy[0]+d,xy[1],xy[0],xy[1]+2*d])
    }
}

// Draws a Triangle //

function drawTriangle(vertices){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to ceate the buffer object");
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW)


    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

// Draws a 3D Triangle //

function drawTriangle3D(vertices){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to ceate the buffer object");
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW)


    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

/*
                    CIRCLES
*/

class Circle{
    constructor(){
        this.type = "circle";
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
        this.segments = g_segmentCount;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Draw
        
        var d = this.size/200.0
               
        let angleStep = 360/this.segments;
            for(var angle = 0; angle < 360; angle=angle+angleStep){
                let centerPt = [xy[0],xy[1]];
                let angle1=angle;
                let angle2=angle+angleStep;
                let vec1=[Math.cos(angle1*Math.PI/180)*d,Math.sin(angle1*Math.PI/180)*d]
                let vec2=[Math.cos(angle2*Math.PI/180)*d,Math.sin(angle2*Math.PI/180)*d]
                let pt1 = [centerPt[0]+vec1[0],centerPt[1]+vec1[1]];
                let pt2 = [centerPt[0]+vec2[0],centerPt[1]+vec2[1]];
            
                drawTriangle( [xy[0],xy[1],pt1[0],pt1[1],pt2[0],pt2[1]])
            }

               
    }
}

/*
                    CUBES
*/

class Cube{
    constructor(){
        this.type = "cube";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = g_segmentCount;
        this.matrix = new Matrix4();
    }

    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);
        
        drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);


        drawTriangle3D([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);
              
        gl.uniform4f(u_FragColor,rgba[0]*.8,rgba[1]*.8,rgba[2]*.8,rgba[3]);

        drawTriangle3D([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,1.0,0.0]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,0.0]);

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,0.0, 0.0,0.0,0.0]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,0.0, 0.0,0.0,0.0]);

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3D([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,1.0,1.0]);
        drawTriangle3D([1.0,0.0,1.0, 0.0,0.0,1.0, 1.0,1.0,1.0]);

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3D([1.0,0.0,1.0, 0.0,0.0,0.0, 0.0,0.0,1.0]);
        drawTriangle3D([1.0,0.0,1.0, 0.0,0.0,0.0, 1.0,0.0,0.0]);

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,0.0]);
        drawTriangle3D([0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,1.0]);

    }
}

// My second "primitive shape"
class Pyramid{
    constructor(){
        this.type = "pyramid";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = g_segmentCount;
        this.matrix = new Matrix4();
    }

    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);
        
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,0.0,1.0]);
        drawTriangle3D([1.0,0.0,1.0, 1.0,0.0,0.0, 0.0,0.0,1.0]);
        
        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 0.5,1,.5]);

        gl.uniform4f(u_FragColor,rgba[0]*.8,rgba[1]*.8,rgba[2]*.8,rgba[3]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,0.0,1.0, 0.5,1,.5]);
        
        gl.uniform4f(u_FragColor,rgba[0]*.7,rgba[1]*.7,rgba[2]*.7,rgba[3]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,1.0, 0.5,1,.5]);

        gl.uniform4f(u_FragColor,rgba[0]*.6,rgba[1]*.6,rgba[2]*.6,rgba[3]);
        drawTriangle3D([0.0,0.0,1.0, 1.0,0.0,1.0, 0.5,1,.5]);



    }
}



// WEBGL SETUP & MAIN //

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById("asg3");

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
      }

      // // Get the storage location of a_Position
      a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
      }
    
      // Get the storage location of u_FragColor
      u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
      if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
      }

      /*u_Size = gl.getUniformLocation(gl.program,'u_Size');
      if (!u_Size) {
        console.log("Failed to get the storage location of u_Size");
        return;
      }*/

      u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
      if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
      }

      u_GlobalRotateMatrix = gl.getUniformLocation(gl.program,'u_GlobalRotateMatrix');
      if (!u_GlobalRotateMatrix) {
        console.log("Failed to get the storage location of u_GlobalRotateMatrix");
        return;
      }

      var identityM = new Matrix4();
      gl.uniformMatrix4fv(u_ModelMatrix,false,identityM.elements);

}

function convertCoordinatesEventToGL(ev){

    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}

var g_shapesList = []

function renderAllShapes(){

    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);


    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var body = new Cube();
    body.color = [1.0,0.0,0.0,1.0];
    body.matrix.translate(-.25,-.3,0.0);
    body.matrix.rotate(0,1,0,0)
    body.matrix.rotate(-g_bodyAngle,1,0,0)
    var bodyCoords = new Matrix4(body.matrix);
    body.matrix.scale(.5,.6,.3);
    body.render(); 

    var arm2 = new Cube();
    arm2.color = [0.5,0.0,0.0,1.0];
    arm2.matrix = new Matrix4(bodyCoords);
    arm2.matrix.translate(.6,0,.05)
    arm2.matrix.rotate(180,0,0,1)
    arm2.matrix.rotate(180,0,1,0)
    arm2.matrix.translate(-.1,-.6,-.2)
    arm2.matrix.rotate(-g_armAngle,0,0,1)
    var arm2Coords = new Matrix4(arm2.matrix)
    arm2.matrix.scale(.2,.6,.2);
    arm2.render();

    var hand1 = new Cube();
    hand1.color = [1.0,1.0,0.0,1.0];
    hand1.matrix = new Matrix4(arm2Coords);
    hand1.matrix.scale(.15,.15,.05)
    hand1.matrix.translate(0,4,1.5);
    hand1.matrix.rotate(-g_handAngle,0,0,1)
    hand1.render();

    var hand2 = new Cube();
    hand2.color = [1.0,1.0,0.0,1.0];
    hand2.matrix = new Matrix4(bodyCoords);
    hand2.matrix.scale(.15,.15,.05)
    hand2.matrix.translate(-1,-1,2);
    hand2.render();

    var arm3 = new Cube();
    arm2.color = [0.5,0.0,0.0,1.0];
    arm2.matrix = new Matrix4(bodyCoords);
    arm2.matrix.translate(-.2,0,.05)
    arm2.matrix.scale(.2,.6,.2);
    arm2.render();

    var leg1 = new Cube();
    leg1.color = [0.0,0.0,.5,1.0];
    leg1.matrix.translate(.05,-.9,.05)
    leg1.matrix.scale(.2,.6,.2);
    leg1.render();

    var leg2 = new Cube();
    leg2.color = [0.0,0.0,.5,1.0];
    leg2.matrix.translate(-.25,-.9,.05)
    leg2.matrix.scale(.2,.6,.2);
    leg2.render();



    // Head //

    var head = new Cube();
    head.color = [1.0,1.0,0.0,1.0];
    head.matrix = bodyCoords;
    head.matrix.translate(.1,.6,0);
    head.matrix.rotate(-g_headAngle,1,0,0);
    var headCoords = new Matrix4(head.matrix);
    head.matrix.scale(.3,.3,.3);
    head.render(); 

    var hat = new Pyramid();
    hat.color = [1,0,0,1];
    hat.matrix = new Matrix4(headCoords);
    hat.matrix.translate(0,.3,0)
    hat.matrix.scale(.3,.3,.3);
    hat.matrix.translate(0,g_hatTranslate,0)
    hat.render();

    var eye1 = new Cube();
    eye1.color = [.3,.3,.3,1];
    eye1.matrix = new Matrix4(headCoords);
    eye1.matrix.translate(0,.15,-.05)
    eye1.matrix.scale(.12,.1,.05);
    eye1.render();

    var eye2 = new Cube();
    eye2.color = [.3,.3,.3,1];
    eye2.matrix = new Matrix4(headCoords);
    eye2.matrix.translate(.18,.15,-.05)
    eye2.matrix.scale(.12,.1,.05);
    eye2.render();

    var eye3 = new Cube();
    eye3.color = [.3,.3,.3,1];
    eye3.matrix = new Matrix4(headCoords);
    eye3.matrix.translate(0.1,.2,-.05)
    eye3.matrix.scale(.12,.05,.05);
    eye3.render();

    /*
    var eye2 = new Cube();
    eye2.color = [.3,.3,.3,1];
    eye2.matrix = new Matrix4(headCoords);
    eye2.matrix.translate(1.4,0,0)
    eye2.matrix.scale(1.1,1,1);
    eye2.render();

    var eye3 = new Cube();
    eye3.color = [.3,.3,.3,1];
    eye3.matrix = new Matrix4(headCoords);
    eye3.matrix.translate(-.45,.6,0)
    eye3.matrix.scale(.6,.4,.4);
    eye3.render();
    */

    //////////////////////////////////////////////////////////


    var duration = performance.now() - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");

}

function sendTextToHTML(text,htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let g_globalAngle = 0;
let g_bodyAngle = 0;
let g_headAngle = 0;
let g_armAngle = 0;
let g_handAngle = 0;
let animation = false;
let g_hatTranslate = 0

function addActionsForHtmlUI(){

    document.getElementById("angleSlide").addEventListener('mousemove',function() {g_globalAngle = this.value; renderAllShapes(); });
    document.getElementById("body").addEventListener('mousemove',function() {g_bodyAngle = this.value; renderAllShapes(); });
    document.getElementById("arm").addEventListener('mousemove',function() {g_armAngle = this.value; renderAllShapes(); });
    document.getElementById("hand").addEventListener('mousemove',function() {g_handAngle = this.value; renderAllShapes(); });
    document.getElementById("head").addEventListener('mousemove',function() {g_headAngle = this.value; renderAllShapes(); });
    

    document.getElementById("animation").onclick = function() {animation = !animation;};

}

function renderScene(){
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    requestAnimationFrame(tick);
}

function main() {
  renderScene();
}

var g_startTime = performance.now()/1000.0
var g_seconds=performance.now()/1000.0-g_startTime;
var timer = 0;

function tick() {

    g_seconds=performance.now()/1000-g_startTime;

    canvas.onmousedown = function(ev){
        console.log("HERE")
        if(ev.buttons){
            console.log(ev.clientX);
            g_globalAngle.x = ev.clientX;
            g_globalAngle.y = ev.clientY;
        }
    }


    updateAnimationAngles();
    canvas.onmousedown = function(ev){
        if((ev.shiftKey && ev.buttons)){
            g_hatTranslate = Math.abs(Math.sin(g_seconds - timer))
            timer = g_seconds;
            console.log(timer)
        }
    }

    if(g_hatTranslate != 0 && (g_seconds - timer < 3)){
        g_hatTranslate = Math.abs(Math.sin(g_seconds - timer))
    }else{
        g_hatTranslate = 0;
    }


    renderAllShapes();
    requestAnimationFrame(tick);
}

function updateAnimationAngles(){
    if(animation){
        g_bodyAngle = 45*Math.sin(g_seconds*10);
        g_armAngle = Math.abs(-30*Math.sin(g_seconds));
        g_headAngle = Math.abs(45*Math.sin(g_seconds*5));
    }
}

