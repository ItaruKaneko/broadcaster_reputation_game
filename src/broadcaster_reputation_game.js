// broadcaster_reputation_game.js
//   agent simulation of reputation of broadcaster
// without broadcast
//   msra message submission receiption agent
//   msra.si  satisfactory index
//     increase by satisfaction, decrease by unsatisfaction
//   msra.fi  faulty index
//     increase by delivery of false information
//   msra action
//     propagate information for satisfactory communication
//   msra_binding_matrix
//     binding of two msra, increased by satisfactory communication
// with broadcast
//   broadcast_preference_factor factor to prefer broadcast
//   msra.ty  broadcaster or individual
//   msra.vi  verifiability index
//      broadcaster's ability to detect false information


// epi stimulation preference index  0.0..1.0
// cpi creditability preference index 0.0..1.0
// ers exitement reputation score
// crs creditability reputation
// ffl forward follower list

var nipm = Array.from({ length: 100 }, () => ({
  epi: null,   // excitement preference index
  cpi: null,   // creditability preference index
  ers: null,   // excitement reputation score
  crs: null,   // creditabitilty reputaiton score
  ffn: null,   // forward follower number
  ffl: null,   // forward follower list
  rmk: null,    // mark
  nai: null    // nip_array index
}));

var p_thresh = 0.2;  // propagaete threshold
var max_followers = 10;    // maximum followers

function nip_array_sync(nipm_no) {
  var ix1 = nipm[nipm_no].nai;
  nip_array[ix1].y = nipm[nipm_no].ers * 600;   // wrong
}

function nipm_initialize() {
  var i;
  for (let i = 0; i <nipm.length; i++) {
    nipm[i].epi = Math.random();
    nipm[i].cpi = Math.random();
    nipm[i].ers = Math.random();
    nipm[i].crs = 0.0;
    nipm[i].ffn = 0;
    nipm[i].ffl = new Array(max_followers);   // max followrd
    nipm[i].rmk = 0;
    nipm[i].nai = i;

    // set y axis as epi
    nip_array_sync(i);
  }
}



// draw propagation line
function draw_propagation(cf,nmx1, nmx2) {
  var ix1 = nipm[nmx1].nai;
  var ix2 = nipm[nmx2].nai;
  var x1 = Math.floor(nip_array[ix1].x);
  var y1 = Math.floor(nip_array[ix1].y);
  var x2 = Math.floor(nip_array[ix2].x);
  var y2 = Math.floor(nip_array[ix2].y);
  if (cf < 0.5) {
    c1.strokeStyle = "red";
  } else {
    c1.strokeStyle = "green";
  }
  c1.lineWidth = 1;
  c1.beginPath();
  c1.moveTo(x1,630-y1);
  c1.lineTo(x2,630-y2);
  c1.stroke();
}


// evaluate propagation
// change score
function eval_propagation(nipm_no, nipm_nx){
  // submtter get 0.05 point of ers
  if (nipm[nipm_no].ers < 0.95) {
    nipm[nipm_no].ers = nipm[nipm_no].ers * 1.05;
    var ix1 = nipm[nipm_no].nai;
    nip_array_sync(nipm_no);
    // nip_array[ix1].y = nipm[nipm_noo].ers * 600;
  }
  // submitter get followers
  if (
      nipm[nipm_no].ers * Math.random() > 0.7
      && Math.random() < 0.1
    )
    {
    if (nipm[nipm_no].ffn < nipm[nipm_no].ffl.length){
      nipm[nipm_no].ffl[nipm[nipm_no].ffn] = nipm_nx;
      nipm[nipm_no].ffn = nipm[nipm_no].ffn + 1;
    }
    var ix;
    ix = nipm[nipm_no].nai;
    nip_array[ix].ep = nipm[nipm_no].ffn* 2 + 4;
  }
}


// propageate news item through nipm
function ni_p(nipm_no, ef, cf){
  // nipm_no  :  nipm number
  // ef : excitement factor
  // cf : creditability factor
  var i;
  for (let i = 0; i <nipm[nipm_no].ffn; i++) {
    ni_p(i,ef,cf);
  }
  if (nipm[nipm_no].rmk >0) return;   // if marked, do nothing
  nipm[nipm_no].rmk = 1;  // mark propagater
  var epi1 = nipm[nipm_no].epi;
  var cpi1 = nipm[nipm_no].cpi;
  var propagate_factor = ef*epi1 + cf * cpi1;   // this is evaluation expression
  while  (propagate_factor > p_thresh) {
    var nipm_nx = Math.floor(Math.random() * nipm.length);
    eval_propagation(nipm_no, nipm_nx);
    draw_propagation(cf,nipm_no, nipm_nx);
    ni_p(nipm_nx, ef, cf);
    propagate_factor -= p_thresh;
  }
}

// exite the first nipm
function nipm_exite(){
  // update nipm index
  var i;
  for (let i = 0; i <nipm.length; i++) {
    nipm[i].ers = nipm[i].ers * 0.98;
    nipm[i].rmk = 0;
  }

  // sort nipm by exitement score
  // nipm.sort((a,b) => b.ers - a.ers);
  // news item propagation
  // index lopwer possibility higher
  var ix = Math.floor(Math.exp(-Math.random()*7)*nipm.length);
  ni_p(ix, Math.random(), Math.random());
}



// class definition : game_cell
// ゲームのます目の定義
function game_cell(n1,x1,y1) {
  this.n=n1; // cell number
  this.x=x1; // cell's x coordinate
 // this.y=0;  // cell's y coordinate
  this.y=y1;
  this.st = 0; // status = 0
  this.author = null;    // copy game agent marking here
  this.ucount = 0;  // use count
}

game_cell.prototype.show=function(){
   // rect を描画
    // y 座標を整数に変換してから描画する    
    var x1,y1;
    x1 = Math.floor(this.x);
    y1 = Math.floor(this.y);
    c1.beginPath();
    c1.shadowColor = 'rgb(0,0,0)';   // 影
    c1.shadowOffsetX = 0;
    c1.shadowOffsetY = 0;
    c1.shadowBlur = 0;

    h1 = this.st*5;
    if(this.st==1){
      c1.fillStyle = 'rgb(0,0,128)'; // 黄色
    } else if (this.st==2) {
      c1.fillStyle = 'rgb(255,128,128)'; // 赤
    } else{
      c1.fillStyle = 'rgb(128,255,255)'; // 水色
    }
    c1.rect(x1*10,350-y1*10, 5,5);
    c1.fill();
}

game_cell.prototype.use=function(){
  // このゲームセルのコンテンツを使う
  author1 = this.author;
  author1.ep = author1.ep + 1;
  this.ucount = this.ucount + 1;
  if (this.ucount >=5) {
    this.author = null;
    this.st = 0;
    this.ucount=0;
  }
}

// --------------
// nipa: news item propagation agent
// can be individual propagater or
// can be small broadcaster
// (ix,iz)は (x.z)の整数値
// 初期化により x,vx はランダムに
// 10<x<580, -25<x<25

function nipa(aid1,gb1,ty1) {
  // nipa shape
  this.aid=aid1;
  this.gb = gb1;    // game board
  this.type = ty1;    // agent type = 2
  this.x = Math.random() * 600 + 10;
  this.y = Math.random() * 600 + 10;
  this.z = 0;
  //if (ty1==1) { // author is in same raw 
  //  this.vy=0;
  //}
  this.ep = 4;  //  energy point = 0
  this.nn=Math.floor(this.y) * 300 + Math.floor(this.x);
}


// move : 移動
// 一番上（iy=0) 
//   gb[this.nn].st=0 なら gb[this.nn].stを1に
//   gb[this.nn].st=1 なら
// y座標を1, vyを10にする

nipa.prototype.progress = function() {
  this.nn=Math.floor(this.x / 10) + Math.floor(this.y / 10)*30;
  this.iz=Math.floor(this.z);
 // type1 author
}

nipa.prototype.move = function() {

}

// show : 表示
nipa.prototype.show = function() {
  // 円を描画
    // y 座標を整数に変換してから描画する    
    var x1,y1;
    x1 = Math.floor(this.x * 1.0);
    y1 = Math.floor(this.y * 1.0);
          
    c1.beginPath();

    c1.arc(x1,630 - y1, this.ep, 0, Math.PI * 2);
    if(this.type==1){
      c1.fillStyle = 'rgb(0,255,128)'; // creator = 緑
    }else if (this.type == 2){
      c1.fillStyle = 'rgb(255,128,128)'; // pirate = ピンク
    }else{
      c1.fillStyle = 'rgba(253, 217, 9, 1)'; // consumer = 青
    }
    c1.shadowColor = 'rgb(128,128,128,)';   // 影
    c1.shadowOffsetX = 0;
    c1.shadowOffsetY = 5;
    c1.shadowBlur = 2;
    c1.closePath();
    c1.fill();
}
function game_title(){
  c1.beginPath();
  c1.rect(50,50,50,50);
  c1.fillStyle = 'rgb(0,255,128)'; // 紺色
  c1.shadowColor = 'rgb(255,0,0)';   // 影
  c1.shadowOffsetX = 0;
  c1.shadowOffsetY = 10;
  c1.shadowBlur = 2;
  c1.closePath();
  c1.fill();
  c1.beginPath();
  c1.rect(150,50,50,50);
  c1.closePath();
  c1.fillStyle = 'rgb(0,255,128)'; // 紺色
  c1.shadowColor = 'rgb(0,0,0)';   // 影
  c1.shadowOffsetX = 0;
  c1.shadowOffsetY = 20;
  c1.shadowBlur = 2;
  c1.fill();
}