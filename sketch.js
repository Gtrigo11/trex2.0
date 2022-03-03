var trex, trex_running, edges;
var groundImage, chao;
var chaoInvisivel
var nuvem
var nuvemImage
var inimigo,  inimigo1, inimigo2, inimigo3, inimigo4, inimigo5, inimigo6
var nuvemJuntas, cactosjuntos
var estadoJogo = "inicio"
var placar = 0
var somPulo,somMorte,somCheckpoint
var gameOver,gameOverImage,restart,restartImage

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  nuvemImage = loadImage("cloud.png")
  inimigo1 = loadImage("obstacle1.png")
  inimigo2 =loadImage("obstacle2.png")
  inimigo3 = loadImage("obstacle3.png")
  inimigo4 = loadImage("obstacle4.png")
  inimigo5 = loadImage("obstacle5.png")
  inimigo6 = loadImage("obstacle6.png")
  trexMorreu = loadImage("trex_collided.png")
  somPulo = loadSound('jump.mp3')
  somMorte = loadSound('die.mp3')
  somCheckpoint = loadSound('checkpoint.mp3')
  gameOverImage = loadImage('gameOver.png')
  restartImage = loadImage('restart.png')
}

function setup(){
  createCanvas(windowWidth,windowHeight);

  nuvemJuntas = new Group()
  cactosjuntos = new Group()

  //criando o trex
  trex = createSprite(50,height-110,20,50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  chaoInvisivel = createSprite(200,height-10,400,10);
  chaoInvisivel.visible = false
  trex.addImage("morreu",trexMorreu)
  
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50

 chao = createSprite(200,height-20,400,20)
 chao.addImage(groundImage)

 trex.debug=false
 trex.setCollider('circle',0,0,50)
 //trex.setCollider('rectangle',60,0,100,200,90)

 gameOver = createSprite(width/2,height/2-30)
 gameOver.addImage(gameOverImage)
 gameOver.visible = false
 restart = createSprite(width/2,height/2+30)
 restart.addImage(restartImage)
 restart.scale = 0.6
 restart.visible = false
}

function draw(){
  //definir a cor do plano de fundo 
  background("white");
  textSize(20)
  fill('black')
  text(placar,30,25)

  if(placar>0 && placar%100===0){
    somCheckpoint.play()
  }

  if(estadoJogo==="inicio"){
    cactos()
    geradornuvens()
    placar=placar+Math.round(getFrameRate()/60)
    chao.velocityX = -(5+placar/100)
    if(chao.x<0){
      chao.x = chao.width/2;
    }
    if(touches.length>0||keyDown("space")&&trex.y>height-55){
      trex.velocityY = -10;
      somPulo.play()
      touches=[]
    }
    trex.velocityY = trex.velocityY + 0.5;
    if(trex.isTouching(cactosjuntos)){
      estadoJogo = "fim"
     somMorte.play()   
    //trex.velocityY  = -12
    }
  }
  
  else if(estadoJogo==="fim"){
  trex.changeAnimation("morreu",trexMorreu)
  chao.velocityX = 0
  cactosjuntos.setVelocityXEach(0)
  nuvemJuntas.setVelocityXEach(0)
  trex.velocityY = 0
  cactosjuntos.setLifetimeEach(-1)
  nuvemJuntas.setLifetimeEach(-1)
  gameOver.visible = true
  restart.visible = true
  if(mousePressedOver(restart)||keyDown('space')||touches.length>0){
    console.log('reninciar')
    recomeco()
    touches=[]
  }
  }
  
 //impedir que o trex caia
  trex.collide(chaoInvisivel)
  drawSprites();
}
  
function geradornuvens(){
  if(frameCount%60===0){
    nuvem = createSprite(width,120)
    nuvem.addImage("nuvem",nuvemImage)
    nuvem.velocityX = -5
    nuvem.y=Math.round(random(10,height-100))
    nuvem.depth=trex.depth
    trex.depth=trex.depth+1 
    nuvemJuntas.add(nuvem)
    nuvem.lifetime = 4000
}
}
function cactos(){
  if(frameCount%60===0){
    inimigo = createSprite(width,height-40)
    inimigo.scale = 0.7
    inimigo.velocityX = -(5+placar/100)
    agua=Math.round(random(1,6))
    switch(agua){
      case 1: inimigo.addImage(inimigo1);
      break;
      case 2: inimigo.addImage(inimigo2);
      break;
      case 3: inimigo.addImage(inimigo3);
      break;
      case 4: inimigo.addImage(inimigo4);
      break;
      case 5: inimigo.addImage(inimigo5);
      break;
      case 6: inimigo.addImage(inimigo6);
      break;
      default:break
    }
    inimigo.depth = trex.depth
    trex.depth = trex.depth+1 
    cactosjuntos.add(inimigo)
    inimigo.lifetime = 4000
}
}
 
  function recomeco(){
    estadoJogo = ('inicio')
    nuvemJuntas.destroyEach()
    cactosjuntos.destroyEach()
    restart.visible = false
    gameOver.visible = false
    placar = 0
    trex.changeAnimation("running", trex_running);
  }
