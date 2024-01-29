class SoundListCreator{
    list = []
    constructor () {
        let backgroundSound = document.createElement('audio')
        backgroundSound.setAttribute('src', './assets/sounds/ambience.mp3')
        backgroundSound.loop = true
        backgroundSound.volume = 0.3
        this.list['backgroundSound'] = backgroundSound

        let spinMusic = document.createElement('audio')
        spinMusic.setAttribute('src', './assets/sounds/win-music.mp3')
        spinMusic.loop = true
        this.list['spinMusic'] = spinMusic

        let startSpinSound = document.createElement('audio')
        startSpinSound.setAttribute('src', './assets/sounds/reels_spin_wind_0.wav')
        startSpinSound.volume = 0.1
        this.list['startSpinSound'] = startSpinSound

        let stopSpinSound = document.createElement('audio')
        stopSpinSound.setAttribute('src', './assets/sounds/reels_stop.mp3')
        this.list['stopSpinSound'] = stopSpinSound

        let smallWinSound = document.createElement('audio')
        smallWinSound.setAttribute('src', './assets/sounds/general_win_0.mp3')
        this.list['smallWinSound'] = smallWinSound

        let bigWinSound = document.createElement('audio')
        bigWinSound.setAttribute('src', './assets/sounds/general_win_1.mp3')
        this.list['bigWinSound'] = bigWinSound

        let megaWinSound = document.createElement('audio')
        megaWinSound.setAttribute('src', './assets/sounds/general_win_2.mp3')
        this.list['megaWinSound'] = megaWinSound
    }
    getList() {
        return this.list
    }
}

export default SoundListCreator