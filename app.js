import GameScene from "./GameScene.js"
import ReelStrip from "./ReelStrip.js"
import SoundListCreator from "./SoundListCreator.js"

const Application = PIXI.Application
const mainApp = new Application({
    antialias: true
})
mainApp.renderer.resize(window.innerWidth, window.innerHeight)
mainApp.renderer.view.style.position = 'absolute'
mainApp.renderer.backgroundColor = 0xFFFFFF
document.body.appendChild(mainApp.view)

let soundListCreator = new SoundListCreator()
let soundList = soundListCreator.getList()
playSound('backgroundSound')

const globalScale = 0.68
let timeoutId = null
let isSpinMusicPlaying = false
let balance = 1000
let currentPrize = 0
let winnerSymbolList = []
let result = []
let buttonDisabled = false

const scene = new GameScene(mainApp)
scene.addObject('./assets/images/ms/bg_city.png', 'bg_city', 0, 0, globalScale, globalScale)
scene.addObject('./assets/images/ms/reel_base.png', 'reel_base', 150, 40, globalScale, globalScale)
const reelStrip = new ReelStrip(mainApp, soundList)
reelStrip.setConfig()
scene.addObject('./assets/images/ms/vegas_baby_logo.png', 'vegas_baby_logo', 320, 0, globalScale, globalScale)
scene.addObject('./assets/images/ms/botton_label.png', 'botton_label', 1000, 450, 0.5, 0.5)
scene.addText('BALANCE', 'balance_title', 1125, 457);
scene.addText(''+balance, 'balance_number', 1125, 485);
scene.addAnimatedObject('girl', 850, 250, globalScale, globalScale, 0.5)

const textureButton = PIXI.Texture.from('./assets/images/ui/btn_play_00.png')
const textureButtonOver = PIXI.Texture.from('./assets/images/ui/btn_play_01.png')
const textureButtonDown = PIXI.Texture.from('./assets/images/ui/btn_play_02.png')
const textureButtonDisable = PIXI.Texture.from('./assets/images/ui/btn_play_03.png')

const button = new PIXI.Sprite(textureButton)
button.anchor.set(0.5)
button.x = 1100
button.y = 600
button.scale.x = 0.5
button.scale.y = 0.5
button.eventMode = 'static'
button.cursor = 'pointer'

button.on('pointerdown', onButtonDown)
button.on('pointerup', onButtonUp)
button.on('pointerupoutside', onButtonUp)
button.on('pointerover', onButtonOver)
button.on('pointerout', onButtonOut)

mainApp.stage.addChild(button)

function onButtonDown()
{
    if (buttonDisabled) {
        return
    }
    this.isdown = true
    this.texture = textureButtonDown
    this.alpha = 1
}

function onButtonUp()
{
    if (buttonDisabled) {
        return
    }
    this.isdown = false
    let girlAnimated = scene.getObjectByName('girl')
    girlAnimated.gotoAndPlay(0)
    buttonDisabled = true
    this.texture = textureButtonDisable

    currentPrize = 0
    updateBalance(-10)
    getRandomResult()
    currentPrize = validateResult(result)
    reelStrip.startReelAnimation(onReelStoped, currentPrize, winnerSymbolList)
    reelStrip.setResult(result)
    if (timeoutId != null) {
        clearTimeout(timeoutId)
    }
    if (!isSpinMusicPlaying) {
        playSound('spinMusic')
    }
    isSpinMusicPlaying = true
}

function onButtonOver()
{
    if (buttonDisabled) {
        return
    }
    this.isOver = true
    if (this.isdown)
    {
        return
    }
    this.texture = textureButtonOver
}

function onButtonOut()
{
    if (buttonDisabled) {
        return
    }
    this.isOver = false
    if (this.isdown)
    {
        return
    }
    this.texture = textureButton
}

function onReelStoped() {
    buttonDisabled = false
    button.texture = textureButton
    updateBalance(currentPrize)
    reelStrip.setPrizeText(''+currentPrize)
    timeoutId = setTimeout(function () {
        isSpinMusicPlaying = false
        stopSound('spinMusic')
    }, 3000)
    if (currentPrize > 0 && currentPrize <= 100) {
        playSound('smallWinSound')
    }
    else if (currentPrize > 100 && currentPrize <= 1000) {
        playSound('bigWinSound')
    }
    else if (currentPrize > 1000) {
        playSound('megaWinSound')
    }
}

function updateBalance(value){
    let balanceValue = scene.getObjectByName('balance_number')
    balance += value
    balanceValue.text = '' + balance
    if (balance <= 0){
        buttonDisabled = true
    }
}

function playSound(name) {
    soundList[name].play()
}

function stopSound(name) {
    soundList[name].pause();
    soundList[name].currentTime = 0;
}

//Server logic
function getRandomResult(params) {
    for (let index = 0; index < 9; index++) {
        result[index] = Math.floor(Math.random() * 10)
    }

    // console.log('Frame list:')
    // console.log(result)
}
function validateResult(result) {
    let symbolCounter = {p1:0, p2:0, p3:0, p4:0, p5:0, p6:0, p7:0, p8:0, p9:0, p10:0}
    for (let index = 0; index < result.length; index++) {
        symbolCounter['p'+(result[index]+1)] += 1
    }
    
    let prize = 0
    let payTable = {
        p1: {4:100, 5:100, 6:750, 7:1000, 8:2500, 9:5000},
        p2: {4:100, 5:100, 6:400, 7: 750, 8:2000, 9:3000},
        p3: {4: 75, 5: 75, 6:250, 7: 400, 8:1000, 9:2500},
        p4: {4: 75, 5: 75, 6:200, 7: 300, 8:1000, 9:2500},
        p5: {4: 50, 5: 50, 6:200, 7: 300, 8: 750, 9:1500},
        p6: {4: 40, 5: 40, 6:100, 7: 200, 8: 500, 9:1000},
        p7: {4: 30, 5: 30, 6: 75, 7: 150, 8: 350, 9: 750},
        p8: {4: 30, 5: 30, 6: 75, 7: 150, 8: 300, 9: 500},
        p9: {4: 25, 5: 25, 6: 50, 7: 100, 8: 200, 9: 400},
        p10:{4: 25, 5: 25, 6: 50, 7: 100, 8: 200, 9: 300}
    }

    for (let index = 1; index <= 10; index++) {
        let value = payTable['p'+index][symbolCounter['p'+index]]
        if (value > 0) {
            prize += value
            winnerSymbolList.push('p'+index)
        }
    }
    // console.log('Symbol Count:')
    // console.log(symbolCounter)
    // console.log('Prize: '+prize)
    // console.log('')
    
    return prize
}
//Server logic

//Sound Table Logic
createSlider(100, 770, 'ambience', 'backgroundSound')
createSlider(200, 770, 'win-music', 'spinMusic')
createSlider(300, 770, 'general_win_0', 'smallWinSound')
createSlider(400, 770, 'general_win_1', 'bigWinSound')
createSlider(500, 770, 'general_win_2', 'megaWinSound')
createSlider(600, 770, 'reel_spin', 'startSpinSound')
createSlider(700, 770, 'reels_stop', 'stopSpinSound')

function createSlider(x, y, soundLabel, soundName) {
    const sliderWidth = 4;
    const sliderHeight = 100;
    const slider = new PIXI.Graphics()
    slider.beginFill(0x000000)
    slider.drawRect(0, 0, sliderWidth, sliderHeight);
    slider.x = x
    slider.y = y

    const handle = new PIXI.Graphics()
    handle.beginFill(0x0000ff)
    handle.drawCircle(0, 0, 8);
    handle.y = slider.height / 2;
    handle.x = sliderWidth / 2;
    handle.eventMode = 'static';
    handle.cursor = 'pointer';
    handle.on('pointerdown', function () {
        onDragStart(handle, slider, soundName)
    })
    handle.on('pointerup', onDragEnd)
    handle.on('pointerupoutside', onDragEnd);

    mainApp.stage.addChild(slider);
    slider.addChild(handle);

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 13,
        fontWeight: 'bold',
        fill: '#000000'
    });

    const textObject = new PIXI.Text(soundLabel, style);
    textObject.anchor.set(0.5, 0.5)
    textObject.x = slider.x
    textObject.y = slider.y + slider.height + 10

    mainApp.stage.addChild(textObject)
}

let currentHandle = null
let currentSlider = null
let currentSoundName = ''

function onDragStart(handle, slider, soundName){
    currentHandle = handle
    currentSlider = slider
    currentSoundName = soundName
    mainApp.stage.eventMode = 'static';
    mainApp.stage.addEventListener('pointermove', onDrag);
}

function onDragEnd(e){
    mainApp.stage.eventMode = 'auto';
    mainApp.stage.removeEventListener('pointermove', onDrag);
}

function onDrag(e){
    const halfHandleHeight = currentHandle.height / 2;
    currentHandle.y = Math.max(halfHandleHeight, Math.min(
        currentSlider.toLocal(e.global).y,
        currentSlider.height - halfHandleHeight,
    ));
    
    const t = 1 - (currentHandle.y / currentSlider.height);
    soundList[currentSoundName].volume = t
}