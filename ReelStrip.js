class ReelStrip {
    stripContainer = new PIXI.Container()
    mainApp = null
    staticStrip = []
    unluckyStrip = []
    blurStrip = []
    staticFrames = []
    unluckyFrames = []
    blurFrames = []
    prizeText = []
    soundList = []
    constructor (mainApp, soundList) {
        this.mainApp = mainApp
        this.soundList = soundList
    }
    setConfig() {
        for (let index = 0; index < 4; index++) {
            const image = PIXI.Sprite.from('./assets/images/ms/reel_spot.png')
            let numY = (index / 2) >> 0
            let numX = index - (numY*2)
            image.x = 195*(numX+1)
            image.y = 188*(numY+1)
            image.scale.x = 0.7
            image.scale.y = 0.7
            image.anchor.set(0.5, 0.5)

            const style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fontWeight: 'bold',
                fill: '#000000'
            })
            const textObject = new PIXI.Text('', style)
            textObject.anchor.set(0.5, 0.5)
            textObject.x = image.x
            textObject.y = image.y
            this.prizeText.push(textObject)

            this.stripContainer.addChild(image)
            this.stripContainer.addChild(textObject)
        }
        for (let i = 1; i < 11; i++)
        {
            const val = i
            this.staticFrames.push(PIXI.Texture.from(`./assets/images/symbols/p${val}_normal.png`))
            this.unluckyFrames.push(PIXI.Texture.from(`./assets/images/symbols/p${val}_unlucky.png`))
        }
        for (let i = 0; i < 28; i++)
        {
            const val = i < 10 ? `0${i}` : i
            this.blurFrames.push(PIXI.Texture.from(`./assets/images/reel_spin/reel_spin_${val}.png`))
        }
        for (let i = 0; i < 9; i++)
        {
            let numY = (i / 3) >> 0
            let numX = i - (numY*3)

            let symbol = new PIXI.AnimatedSprite(this.staticFrames)
            symbol.x = 190*numX
            symbol.y = 190*numY
            symbol.scale.x = 0.7
            symbol.scale.y = 0.7
            symbol.currentFrame = Math.floor(Math.random() * 10)
            this.staticStrip.push(symbol)

            let unluckySymbol = new PIXI.AnimatedSprite(this.unluckyFrames)
            unluckySymbol.x = 190*numX
            unluckySymbol.y = 190*numY
            unluckySymbol.scale.x = 0.7
            unluckySymbol.scale.y = 0.7
            this.unluckyStrip.push(unluckySymbol)

            let blurSymbol = new PIXI.AnimatedSprite(this.blurFrames)
            blurSymbol.x = 190*numX
            blurSymbol.y = 190*numY
            blurSymbol.scale.x = 0.7
            blurSymbol.scale.y = 0.7
            blurSymbol.animationSpeed = 0.3
            blurSymbol.loop = false
            this.blurStrip.push(blurSymbol)

            this.stripContainer.addChild(symbol)
            this.stripContainer.addChild(unluckySymbol)
            this.stripContainer.addChild(blurSymbol)
        }
        this.stripContainer.x = 212
        this.stripContainer.y = 95
        this.mainApp.stage.addChild(this.stripContainer)

        for (let index = 0; index < this.unluckyStrip.length; index++) {
            this.unluckyStrip[index].visible = false
        }
        for (let index = 0; index < this.blurStrip.length; index++) {
            this.blurStrip[index].visible = false
        }
    }
    startReelAnimation(onCompleteAnimation, prize, winnerSymbolList) {
        let executeOnComplete = true
        let symbolStoppedCount = 0
        for (let index = 0; index < this.staticStrip.length; index++) {
            this.unluckyStrip[index].visible = false
            this.staticStrip[index].visible = false
        }
        for (let index = 0; index < this.blurStrip.length; index++) {
            this.playSound('startSpinSound')
            this.blurStrip[index].visible = true
            this.blurStrip[index].gotoAndPlay(0)
            this.blurStrip[index].onComplete = () => {
                this.stopSound('startSpinSound')
                this.playSound('stopSpinSound')
                if (prize > 0) {
                    if (winnerSymbolList.includes('p'+(this.staticStrip[index].currentFrame+1))) {
                        this.staticStrip[index].visible = true
                    }
                    else {
                        this.unluckyStrip[index].visible = true
                    }
                }
                else {
                    this.staticStrip[index].visible = true
                }
                this.blurStrip[index].visible = false
                symbolStoppedCount += 1
                if (symbolStoppedCount == 9) {
                    onCompleteAnimation()
                }
            }
        }
        this.setPrizeText(0)
    }
    setResult (result) {
        for (let index = 0; index < this.staticStrip.length; index++) {
            this.staticStrip[index].currentFrame = result[index]
            this.unluckyStrip[index].currentFrame = result[index]
        }
    }
    setPrizeText(prize){
        if (prize > 0) {
            for (let index = 0; index < this.prizeText.length; index++) {
                this.prizeText[index].text = prize
            }
        }
        else {
            for (let index = 0; index < this.prizeText.length; index++) {
                this.prizeText[index].text = ''
            }
        }
    }
    playSound(name) {
        this.soundList[name].play()
    }

    stopSound(name) {
        this.soundList[name].pause();
        this.soundList[name].currentTime = 0;
    }
    getContainer () {
        return stripContainer
    }
}

export default ReelStrip