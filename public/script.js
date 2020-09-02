let myVideoStream;
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
const socket = io('/')
myVideo.muted = true


const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '2000'
});



navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    peer.on('call', (call) => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    });

    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    console.log('new-user', userId);
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}


/* Chat Funtionality */
let text = $('input');
$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log('lklkllkllk', text.val());
        socket.emit('message', text.val())
        text.val('')
    }
})

socket.on('createMessage', message => {
    $('ul').append(`<li class='message'><b>user</b><br/>${message}</li>`)
    scrollToBottom()
})

/* Scroll Bottom */

const scrollToBottom = () => {
    let sc = $('.main__chat__window')
    sc.scrollTop(sc.prop('scrollHeight'))
}


/* mute unmute */
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton()
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true
    }
}

const setMuteButton = () => {
    const html = `<i class="fa fa-microphone"></i> <span>Mute</span>`
    document.querySelector('.main__mute__button').innerHTML = html
}

const setUnmuteButton = () => {
    const html = `<i class="unmute fa fa-microphone-slash"></i> <span>Unmute</span>`
    document.querySelector('.main__mute__button').innerHTML = html
}

/* enable disable video */

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true
    }
}

const setStopVideo = () => {
    const html = `<i class="fa fa-video"></i> <span>Stop Video</span>`
    document.querySelector('.main__video__button').innerHTML = html
}

const setPlayVideo = () => {
    const html = `<i class="stop__video fa fa-video-slash"></i> <span>Play Video</span>`
    document.querySelector('.main__video__button').innerHTML = html
}
