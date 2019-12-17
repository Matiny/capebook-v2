
$(document).ready(
  () => {

    // Wallpaper

    let imgList = ["antwasp", "aquaman", "batman", "blackpanther", "blackwidow", "darkseid", "drstrange", "green", "incredible", "miles", "mysterio", "shazam", "thanos", "whitecanary", "wonderwoman"];

    let random = Math.floor(Math.random() * 14);

    $("main").css({"background-image": `url(img/bgs/${imgList[random]}.jpg)`});
  }
)