const readURL = (input) => {
    let preview = document.getElementById('preview-image-product')
    console.log(preview)
    if (input.files) {
        for(let i=0 ; i < input.files.length ; i++) {
            var reader = new FileReader();
            reader.onload = function (e) { 
                let image = document.createElement("img")
                image.setAttribute("src",e.target.result)
                // image.setAttribute('width', '150px')
                image.setAttribute('height', '200px')
                image.setAttribute('style', 'margin-right : 10px')
                preview.appendChild(image)
            };
      
            reader.readAsDataURL(input.files[i]); 
        }
      }
}