window.onload = (ev) => {
    let closeBtn = document.querySelector('#btnClose');
    if(closeBtn !== null) {
        closeBtn.onclick = () => {
            let toastValue = new bootstrap.Toast(document.querySelector('#accountReq'))
            return toastValue.hide()
        }
    }

    let itemNew = document.querySelector('.item-new');
    if(itemNew !== null) {
        itemNew.onclick = () => {
            return window.location =  '/product/all'
        }
    }
}