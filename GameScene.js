class GameScene {
    objectList = []
    mainApp = null

    constructor(mainApp){
        this.mainApp = mainApp
    }
    addObject(path, ObjectName, x=0, y=0, scaleX=1, scaleY=1) {
        const image = PIXI.Sprite.from(path)
        image.x = x
        image.y = y
        image.scale.x = scaleX
        image.scale.y = scaleY
        this.mainApp.stage.addChild(image)
        this.objectList[ObjectName] = image
    }
    addText(text, ObjectName, x=0, y=0, scaleX=1, scaleY=1){
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#FFFF00'
        });
        
        const textObject = new PIXI.Text(text, style);
        textObject.anchor.set(0.5, 0.5)
        textObject.x = x
        textObject.y = y
        textObject.scale.x = scaleX
        textObject.scale.y = scaleY

        this.mainApp.stage.addChild(textObject)
        this.objectList[ObjectName] = textObject
    }
    addAnimatedObject(ObjectName, x=0, y=0, scaleX=1, scaleY=1, animationSpeed = 1){
        const frames = []
        for (let i = 0; i < 30; i++)
        {
            const val = i < 10 ? `0${i}` : i
            frames.push(PIXI.Texture.from(`./assets/images/iddle_girl_ms/girl_mainscreen_iddle_${val}.png`))
        }
        const anim = new PIXI.AnimatedSprite(frames)
        anim.x = x
        anim.y = y
        anim.scale.x = scaleX
        anim.scale.y = scaleY
        anim.animationSpeed = animationSpeed
        anim.loop = false
        this.mainApp.stage.addChild(anim)
        this.objectList[ObjectName] = anim
    }
    getObjectByName(name) {
        return this.objectList[name]
    }
}

export default GameScene