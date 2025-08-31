// プログラム全体で使用する変数
var c1;        // ゲームボード描画コンテキスト
var c2;        // グラフ描画コンテキスト
var nip_array = new Array(50);  // 全 nipa を格納する配列
var number_of_nip_agent; // nipa の数;    
var number_of_broadcasters; // broadcasters の数
var gb;        // game bord, sixze 600
var tick_count1;      // tick count 1








// 現状をplotする

function plot_status(){
  var x1 = Math.floor(tick_count1+1);
  if (x1>599) x1=599;
  esum=0; // 全体のエネルギー
  ncnt=0; // 全体の生きているエージェントの数
  aena=0; // 著作者のエネルギー
  var n;
  for (n = 0; n < number_of_nip_agent; n++) {
    esum=esum + nip_array[n].ep;
    if (nip_array[n].ep > 0 && nip_array[n].type==1) {
      ncnt=ncnt + 1;
      aena=aena + nip_array[n].ep;
    }
  }
  c2.beginPath();
  c2.rect(x1 + 40,390-esum, 1,1);
  c2.fillStyle = 'rgb(0,64,64)'; // 紺色
  c2.fill();
  c2.beginPath();
  c2.rect(x1 + 40,390-ncnt*4, 1,1);
  c2.fillStyle = 'rgb(128,0,64)'; // 紺色
  c2.fill();
  c2.beginPath();
  c2.rect(x1 + 40,390-aena, 1,1);
  c2.fillStyle = 'rgb(0,128,64)'; // 紺色
  c2.fill();
}

function plot_axis(){
  c2.beginPath();
  c2.fillStyle = 'rgb(0,0,0)'; // 紺色
  c2.rect(40,10,540,380);
  c2.stroke();
  var n;
  for (n=0; n<540; n+=50) {
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 紺色
    c2.rect(n+40,386,1,4);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),n+35,402);
  }
  for (n=0; n<380; n+=20) {
    // 左側の目盛
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 黒
    c2.rect(40,390-n,4,1);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),20,390 - n);
    // 右側の目盛
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 黒
    c2.rect(576,390-n,4,1);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    var n1 = n / 4;
    c2.fillText(n1.toString(10),585,390 - n);
  }
  //c2.filltext("tick",210,220)
}

// 初期化
function init_simulation(){
  // plot_axis()
  tick_count1=0; // tick count をゼロリセット
  gb = new Array(90000);
  // game bord のクリア
  var n1=0;
  for (var y1=0; y1<30; y1++) {
    for (var x1=0; x1<30; x1++) {
      gb[n1]=new game_cell(n1,x1,y1);
      n1++;
    }
  }
  // nipa数の設定
  number_of_nip_agent = nip_array.length;
  number_of_broadcasters = 20;

  // 全nipaを格納する配列の準備
  // nip_array = new Array(number_of_nip_agent);  
  // 全nipaの初期化
  for (var n = 0; n < number_of_nip_agent; n++) {
    if(n < number_of_broadcasters) {
    nip_array[n]=new nipa(n,gb,1);
    }
    else {
      nip_array[n]=new nipa(n,gb,2);
    }
  }

}

// one tick, information propagation

// nipa クラスを使ったアニメーションの本体
// 毎秒 30 回実行する関数
function tick1() {
  tick_count1=tick_count1+1;
  // 描画領域をいったんクリアする
  c1.clearRect(0, 0, 600, 600);

  // gb - game_cell を描画する
  var n;
  for (n = 0; n < 900; n++){
    gb[n].show();
  }
  // copygame agents を動かす
  for (n = 0; n < number_of_nip_agent; n++) {
    // nipa を移動し、描画する
    nip_array[n].progress();
    nip_array[n].move();
    nip_array[n].show();
  }
  if (tick_count1 > 500) {
    init_simulation()
  }
//  plot_status();
}

// canvas 初期化
function draw_canvas() {
  // c1 = 2d コンテキスト、を用意する
  var canv1 = document.getElementById('canvas_tag_1');
  c1 = canv1.getContext('2d');
  if (!canv1 || !canv1.getContext) {
      return false;
  }
  // var canv2 = document.getElementById('canvas_tag_2');
  // c2 = canv2.getContext('2d');
  // if (!canv2 || !canv2.getContext) {
  //     return false;
  // }

  // c2.clearRect(0, 0, 600, 600);
  init_simulation()
  // tick1 を毎秒 30 回実行するための設定
  // plot_axis();
  setInterval(tick1, 100);
}