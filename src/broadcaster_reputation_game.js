// broadcaster_reputation_game.js
//   agent simulation of reputation of broadcaster
// without broadcast
//   nipa news item propagatio agent
//   nipa.si  satisfactory index
//     increase by satisfaction, decrease by unsatisfaction
//   nipa.fi  faulty index
//     increase by delivery of false information
//   nipa action
//     propagate information for satisfactory communication
//   nipa_binding_matrix
//     binding of two nipa, increased by satisfactory communication
// with broadcast
//   broadcast_preference_factor factor to prefer broadcast
//   nipa.ty  broadcaster or individual
//   nipa.vi  verifiability index
//      broadcaster's ability to detect false information
//   



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

// (ix,iz)は (x.z)の整数値
// 初期化により x,vx はランダムに
// 10<x<580, -25<x<25
// y, vyは0に初期化

function broadcaster_agent(aid1,gb1,ty1) {
  this.aid=aid1;
  this.gb = gb1;    // game board
  this.type = ty1;    // agent type = 2
  this.x = Math.random() * 270 + 10;
  this.y = Math.random() * 270 + 10;
  this.z = 0;
  //if (ty1==1) { // author is in same raw 
  //  this.vy=0;
  //}
  this.vz = 0;
  this.ep = 4;  //  energy point = 0
  this.nn=Math.floor(this.y) * 300 + Math.floor(this.x);
  this.iz=Math.floor(this.z);
}


// move : 移動
// 一番上（iy=0) 
//   gb[this.nn].st=0 なら gb[this.nn].stを1に
//   gb[this.nn].st=1 なら
// y座標を1, vyを10にする

broadcaster_agent.prototype.progress = function() {
  this.nn=Math.floor(this.x / 10) + Math.floor(this.y / 10)*30;
  this.iz=Math.floor(this.z);
 // type1 author
}
broadcaster_agent.prototype.move = function() {
  // consumer type
  if(this.nn < 0 || this.nn>=90000) {
    console("error, this.nn range")
  }
  if (this.x < 10  || this.x > 280) {
      this.vx = - this.vx;
  }  
  if (this.y < 10  || this.y > 280) {
    this.vy = - this.vy;
}  
// gravity
  if (this.z > 0) {
    this.vz -= 1;
  }
  // motion
  this.z += this.vz;
  // collision with ground
  if (this.z<0) {
    this.z=0;
    this.vz=0;
  }
}

// show : 表示
broadcaster_agent.prototype.show = function() {
  // 円を描画
    // y 座標を整数に変換してから描画する    
    var x1,z1;
    x1 = Math.floor(this.x + this.y * 1.0);
    z1 = Math.floor(this.z + this.y* 1.0);
    z2 = Math.floor(this.z);
          
    c1.beginPath();

    c1.arc(x1,330-z1-z2, this.ep, 0, Math.PI * 2);
    if(this.type==1){
      c1.fillStyle = 'rgb(0,255,128)'; // creator = 緑
    }else if (this.type == 2){
      c1.fillStyle = 'rgb(0,128,255)'; // consumer = 青
    }else{
      c1.fillStyle = 'rgb(255,128,128)'; // pirate = ピンク
    }
    c1.shadowColor = 'rgb(128,128,128,)';   // 影
    c1.shadowOffsetX = 0;
    c1.shadowOffsetY = z2+5;
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