var video, canvas, context, imageData, detector
var card = document.getElementById('card')

function onLoad() {
  video = document.getElementById("video")
  canvas = document.getElementById("canvas")
  context = canvas.getContext("2d")

  // 不同浏览器api兼容
  navigator.getUserMedia = navigator.getUserMedia || 
                            navigator.webkitGetUserMedia || 
                            navigator.mozGetUserMedia;
  if (navigator.getUserMedia) {
    // 成功调用的回调
    function successCallback(stream) {
      if (window.URL) {
        video.src = window.URL.createObjectURL(stream) // 创建video标签可用src
      } else if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream
      } else {
        video.src = stream
      }
    }
    // 失败调用的回调
    function errorCallback(error) {
      console.log('调用摄像头失败：', error)
    }

    navigator.getUserMedia({
      video: true
    }, successCallback, errorCallback)
    // 创建一个AR.Detector对象,为了后面的识别
    detector = new AR.Detector()

    requestAnimationFrame(tick)
  }
}

var dur = 500
var lastTime = 0
var isSmall = false

function tick(time) {
  requestAnimationFrame(tick)

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    snapshot()

    var markers = detector.detect(imageData)

    if (markers.length !== 0) {
      drawCorners(markers)
      drawId(markers)
      drawIDCard(markers)
      card.classList.add('active')
    } else {
      card.classList.remove('active')
    }

  }
}

function snapshot() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  imageData = context.getImageData(0, 0, canvas.width, canvas.height)
}

function drawCorners(markers) {
  var corners, corner, i, j
  var colors = ['orange', 'yellow', 'green', 'blue']
  context.lineWidth = 3

  for (i = 0; i !== markers.length; i++) {
    corners = markers[i].corners

    context.strokeStyle = "red"
    for (var k = 0; k < markers.length; k++) {
      context.save()
      context.fillStyle = colors[k]
      context.fillRect(corners[k].x, corners[k].y, 3, 3)
      context.restore()
    }
  }
}



function drawIDCard(markers) {
  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i]
    var corners = marker.corners
    var p0 = corners[0]

    card.style.left = p0.x - 180
    card.style.top = p0.y - 100
  }
}


function drawId(markers) {
  var corners, corner, x, y, i, j

  context.strokeStyle = "blue"
  context.lineWidth = 1

  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners

    x = Infinity
    y = Infinity

    for (j = 0; j !== corners.length; ++j) {
      corner = corners[j]

      x = Math.min(x, corner.x)
      y = Math.min(y, corner.y)
    }

    context.strokeText(markers[i].id, x, y)
  }
}

window.onload = onLoad
