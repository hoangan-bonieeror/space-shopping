var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar-space").style.top = "0";
  } else {
    document.getElementById("navbar-space").style.top = "-70px";
  }
  prevScrollpos = currentScrollPos;
}

function sortValue(sortSelect) {
  try {
    let productList = [...document.getElementsByClassName('productItem')];
    
    switch (sortSelect.value) {
      case '0' : 
        productList
          .sort((previous, next) => {
            return parseInt(previous.children[0].children[1].children[1].innerHTML.slice(0,previous.children[0].children[1].children[1].innerHTML.length-1)) - parseInt(next.children[0].children[1].children[1].innerHTML.slice(0,next.children[0].children[1].children[1].innerHTML.length-1)) })
        break;
      case '1' :
        console.log(sortSelect.value);
        productList
          .sort((previous, next) => { 
            return parseInt(next.children[0].children[1].children[1].innerHTML.slice(0,next.children[0].children[1].children[1].innerHTML.length-1)) - parseInt(previous.children[0].children[1].children[1].innerHTML.slice(0,previous.children[0].children[1].children[1].innerHTML.length-1)) })
        break;
    }

    let containerProduct = document.getElementById('productList');
    
    console.log()
    for(let j=0 ; j<containerProduct.children.length ; j++) {
      // console.log([...containerProduct.children[j].classList].includes('productItem') && i<productList.length, containerProduct.children.length,  j)
      if([...containerProduct.children[j].classList].includes('productItem')) {
        containerProduct.removeChild(containerProduct.children[j])
      }
    }

    for(let product of productList) {
      containerProduct.appendChild(product)
    }

    return;
  } catch(err) {
    console.log(err)
  }
}


function addToCart(btn) {
  if(document.cookie.token !== undefined) {
    btn.parentElement.submit()
  } else {
    let alertWarning = document.createElement('div')
    alertWarning.classList.add('alerts')
    alertWarning.id = 'alertWarning'

    let bodyAlert = document.createElement('div')
    bodyAlert.classList.add('alert')
    bodyAlert.classList.add('alert-warning')

    let divIcon = document.createElement('div')
    divIcon.classList.add('icon', 'pull-left')
    divIcon.id = 'icon'

    let icon = document.createElement('i')
    icon.classList.add('fa', 'fa-exclamation-circle', 'fa-2x')

    let contentAlert = document.createElement('div')
    contentAlert.classList.add('copy')
    
    let headerContent = document.createElement('h4')
    headerContent.textContent = 'Warning'

    let textAlert = document.createElement('p')
    textAlert.textContent = 'Required Account'

    contentAlert.appendChild(headerContent)
    contentAlert.appendChild(textAlert)

    divIcon.appendChild(icon)

    bodyAlert.appendChild(divIcon)
    bodyAlert.appendChild(contentAlert)

    alertWarning.appendChild(bodyAlert)

    if(document.getElementById('alertWarning') === null) {
      document.body.appendChild(alertWarning)
    } else {
      document.body.replaceChild(
        alertWarning,
        [...document.body.children].find(element => {
          return [...element.classList].includes('alerts')
        }))
    }
  }
}

window.onload = (ev) => {
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

    let categoryFilter = document.getElementById('categoryFilter')
    let brandFilter = document.getElementById('brandFilter')

    let inputInCategoryFilter = categoryFilter.querySelectorAll('input')
    let inputInBrandFilter = brandFilter.querySelectorAll('input')

    inputInCategoryFilter.forEach(input => {
      input.onchange = (e) => {
        inputInCategoryFilter.forEach(i => {
          if(i.checked !== true) {
            (input.checked) ? i.disabled = true : i.disabled = false
          }
        })
      }
    })


    inputInBrandFilter.forEach(input => {
      input.onchange = (e) => {
        inputInBrandFilter.forEach(i => {
          if(i.checked !== true) {
            (input.checked) ? i.disabled = true : i.disabled = false
          }
        })
      }
    })

    if(!window.location.href.includes('product/all')) {
      if(window.location.href.includes('id_category')) {
        inputInCategoryFilter.forEach(input => {
          if(input.checked !== true) {
            input.disabled = true
          }
        })
      }
      if(window.location.href.includes('id_brand')) {
        inputInBrandFilter.forEach(input => {
          if(input.checked !== true) {
            input.disabled = true
          }
        })
      }
    }

    let rowResult = document.getElementById('rowResult')
    if(rowResult) {
      let filterArea = document.getElementById('filterArea')

      filterArea.classList.add('show')
    }

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