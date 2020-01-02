
$(document).ready(
  () => {

    // Wallpaper

    let imgList = ["antwasp", "aquaman", "batman", "blackpanther", "blackwidow", "darkseid", "drstrange", "green", "incredible", "miles", "mysterio", "shazam", "thanos", "whitecanary", "wonderwoman"];

    let random = Math.floor(Math.random() * 14);

    $("main").css({"background-image": `url(img/bgs/${imgList[random]}.jpg)`});

    // Custom File Upload

    $("#avatar").change(() => {
      let chosenImage = $("#avatar").prop("files")[0].name;
      $("label[for='avatar']").html(` <img id="add-photo-icon" src="img/svg/add-photo.svg" alt="">${chosenImage}`);
    })
  }
)