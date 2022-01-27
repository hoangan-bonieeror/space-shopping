window.onload = (ev) => {
    let closeBtn = document.querySelector('#btnClose');
    if(closeBtn !== null) {
        closeBtn.onclick = () => {
            let toastValue = new bootstrap.Toast(document.querySelector('#accountReq'))
            return toastValue.hide()
        }
    }

    let closeAlert = document.getElementsByClassName('close')
    if(closeAlert.length !== 0) {
        closeAlert[0].onclick = () => {
            let alertBox = closeAlert[0].parentElement
            alertBox.classList.remove('bounceInRight');
            alertBox.classList.add('bounceOutRight');
            alertBox.style.display = 'none'
        }
    }

    let itemNew = document.querySelector('.item-new');
    if(itemNew !== null) {
        itemNew.onclick = () => {
            return window.location =  '/product/all'
        }
    }

    let brandSpace = document.getElementById('brandSpace')
    let subnav_space = document.getElementById('subnav-space')

    fetch('https://shoppingapi-server.herokuapp.com/customer/brand')
    .then(async res => {
        let data = await res.json()
        let listGroup = document.createElement('div')
        listGroup.className = 'list-group'

        data.data.forEach(brand => {
            let brandItem = document.createElement('a')
            brandItem.className = 'list-group-item'
            brandItem.href = `/product/filter?id_brand=${brand.id}`
            brandItem.textContent = brand.name
            listGroup.appendChild(brandItem)
        });

        brandSpace.appendChild(listGroup)

        let copy_listgroup = listGroup.cloneNode(true)

        subnav_space.appendChild(copy_listgroup)
    })

    // fetch('https://shoppingapi-server.herokuapp.com/customer/category')
    // .then(async res => {
    //     let data = await res.json()
    //     console.log(data)
    //     let listGroup = document.createElement('div')
    //     listGroup.className = 'list-group'

    //     data.data.forEach(category => {
    //         let categoryItem = document.createElement('a')
    //         categoryItem.className = 'list-group-item'
    //         categoryItem.textContent = category.name
    //         listGroup.appendChild(categoryItem)
    //     });

    //     brandSpace.appendChild(listGroup)
    //     subnav_space.appendChild(listGroup)
    // })

}