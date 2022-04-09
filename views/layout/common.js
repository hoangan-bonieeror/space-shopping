var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar-space").style.top = "0";
  } else {
    document.getElementById("navbar-space").style.top = "-80px";
  }
  prevScrollpos = currentScrollPos;
}

function disableSroll() {
  document.body.classList.add("stop-scrolling");
}

function enableSroll() {
  document.body.classList.remove("stop-scrolling");
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
      case '2' :
        productList
          .sort((prev,next)=> {
            return new Date(next.children[0].children[1].children[2].innerHTML) - new Date(prev.children[0].children[1].children[2].innerHTML)
          })
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


function deleteItem(btn) {
  let rowSelect = btn.parentElement.parentElement
  let cartTbl = rowSelect.parentElement.parentElement
  let rowSelectId = rowSelect.id
  let [title, id_product] = rowSelectId.split('-')

  let listCookies = document.cookie.split(';')
  let currentUserId;
  
  listCookies.forEach(cookie => {
    
    if(cookie.includes('id')) {
      let [ name, value ] = cookie.split('=')
      
      currentUserId = value.trim()
    }
  })

  fetch(`https://shoppingapi-server.herokuapp.com/api/user/${currentUserId}/cart/delete/${id_product}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if(data.code === 200) {
        let oldElement = rowSelect
        rowSelect.classList.add('removeItem')
      
        cartTbl.children[0].replaceChild(oldElement, rowSelect)
      
        setTimeout(()=> {
          cartTbl.children[0].removeChild(rowSelect)
        } , 500)
        
        
        if(cartTbl.id === 'cartTbl') {
         let cartTblMini = document.getElementById('cartTbl-mini');
      
         [...cartTblMini.children[0].children].forEach(row => {
           if(row.id === rowSelectId) {
             cartTblMini.children[0].removeChild(row)
           }
         })
      
         let listItem = cartTblMini.children
         
         if(listItem.length === 0) {
          let msgElement = document.createElement('h4')
          msgElement.id = 'empty-cart-msg'
          msgElement.textContent = 'Your cart is empty !'
          msgElement.style.color = 'white'
          
          let msgElemenMini = msgElement.cloneNode(true)
          msgElemenMini.style.color = 'black'
          msgElemenMini.style.marginTop = '1rem'
          msgElemenMini.style.borderBottom = '2px solid black'
          msgElemenMini.style.paddingBottom = '.5rem'
      
          cartTblMini.parentElement.prepend(msgElemenMini)
          cartTbl.parentElement.parentElement.appendChild(msgElement)
        } else {
          let itemDelete = [...listItem].find(item => {
            let [title, value] = item.id.split('-')
            return parseInt(value) === parseInt(id_product)
          })


          if(itemDelete) {
            let [qtyItemDelete] = itemDelete.children[1].children[1].textContent.split('x')
            document.getElementById('totalNum').textContent = parseInt(document.getElementById('totalNum').textContent) - parseInt(qtyItemDelete.trim())
            cartTblMini.removeChild(itemDelete)
          }
        }
        } else if(cartTbl.id === 'cartTbl-mini') {
          let cartTbl_normal = document.getElementById('cartTbl');
      
          [...cartTbl_normal.children[0].children].forEach(row => {
            if(row.id === rowSelectId) {
              let oldElement_normal = row
              row.classList.add('removeItem')
      
              cartTbl_normal.children[0].replaceChild(oldElement_normal, row)
      
              setTimeout(()=> {
                cartTbl_normal.children[0].removeChild(row)
      
                let listItem = cartTbl_normal.children[0].children
          
                if(listItem.length === 0) {
                 let msgElement = document.createElement('h4')
                 msgElement.id = 'empty-cart-msg'
                 msgElement.textContent = 'Your cart is empty !'
                 msgElement.style.color = 'black'
        
                 let msgElementNormal = msgElement.cloneNode(true)
                 msgElementNormal.style.color = 'white'
      
                 msgElement.style.marginTop = '1rem'
                 msgElement.style.borderBottom = '2px solid black'
                 msgElement.style.paddingBottom = '.5rem'
      
                 cartTbl.parentElement.prepend(msgElement)
                 cartTbl_normal.parentElement.parentElement.appendChild(msgElementNormal)
                }
              } , 500)
            }
          })
        }
      }
    })
}

function clickToEdit(btn) {
  btn.style.display = "none"
  let btnEdit = document.getElementById('editSubmit')
  let cancelEdit = document.getElementsByClassName('btn-unedit')

  cancelEdit[0].style.display = btnEdit.style.display = "block"

  let formEdit = document.getElementById('formEdit')

  let listInput = formEdit.querySelectorAll('input');
  
  let listSelect = formEdit.querySelectorAll('select');

  [...listInput].forEach(input => {
    if(input.getAttribute('name') !== "email") {
      input.disabled = false
      input.style.backgroundColor = "white"
      input.style.color = "black"
    }
  })

  listSelect[0].disabled = false
  listSelect[0].style.backgroundColor = "white"
  listSelect[0].style.color = "black"
}

function cancelEdit(btn) {
  btn.style.display = "none"
  let btnSubmit = document.getElementById('editSubmit')
  btnSubmit.style.display = "none"

  let listInput = formEdit.querySelectorAll('input');

  let listSelect = formEdit.querySelectorAll('select');
  
  [...listInput].forEach(input => {
    if(input.getAttribute('name') !== "email") {
      input.disabled = true
      input.style.backgroundColor = "#484848"
      input.style.color = "white"
    }
  })

  listSelect[0].disabled = "true"
  listSelect[0].style.backgroundColor = "#484848"
  listSelect[0].style.color = "white"

  let editBtn = document.getElementById('enableEdit')
  editBtn.style.display = "block"
}


function addToCart(btn) {
  // console.log(document.cookie.includes('token'))
  if(document.cookie.includes('token')) {
    let form = btn.parentElement

    
    let listInput = form.querySelectorAll('input');
    
    let body = {};

    [...listInput].forEach(input => {
      // console.log(input.name, input.value)
      body[input.name] = input.value
    })
    
    let listCookies = document.cookie.split(';')
    let currentUserId;
    
    listCookies.forEach(cookie => {
      
      if(cookie.includes('id')) {
        let [ name, value ] = cookie.split('=')
        
        currentUserId = value.trim()
      }
    })

    fetch(`https://shoppingapi-server.herokuapp.com/api/add-to-cart/${currentUserId}`, {
      method : 'POST',
      headers  : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        if(data.code === 200) {
          if(document.getElementById('empty-cart-msg') !== null) {
            let msgEmpty = document.getElementById('empty-cart-msg')
            msgEmpty.parentElement.removeChild(msgEmpty)
          }

          let cartTbl = document.getElementById('cartTbl-mini');

          let rowItem = document.createElement('tr')
          rowItem.id = `product-${data.itemNew.id}`
        
          let colImg = document.createElement('th')
          colImg.style.width = '20%'
          let imgItem = document.createElement('img')
          imgItem.src = data.itemNew.image
          imgItem.style.width = imgItem.style.height = '100%'
          imgItem.style.objectFit = 'cover'
          imgItem.style.borderRadius = '.5rem'
          colImg.appendChild(imgItem)

          let colInformation = document.createElement('td')
          let nameItem = document.createElement('p')
          nameItem.textContent = data.itemNew.name
          nameItem.style.marginBottom = '5px'

          let qtyItem = document.createElement('p')
          qtyItem.textContent =  `${data.itemNew.qty} x $${data.itemNew.price}`
          qtyItem.style.marginBottom = '0'

          colInformation.append(nameItem, qtyItem)

          let colDel = document.createElement('td')
          colDel.style.width = '15%'
          let btnDel = document.createElement('button')
          btnDel.classList.add('btn','btn-outline-dark')
          btnDel.type = 'button'
          btnDel.onclick = 'deleteItem(this)'

          let iconDel = document.createElement('i')
          iconDel.classList.add('fas','fa-trash')

          btnDel.appendChild(iconDel)
          colDel.appendChild(btnDel)

          rowItem.append(colImg, colInformation, colDel);

          
          let itemExist = [...cartTbl.children].find(item => {
            let [title, id] = item.id.split('-')
            return parseInt(id) === parseInt(data.itemNew.id)
          })
          
          if(itemExist === undefined) {
            cartTbl.prepend(rowItem)
          } else {
            console.log('here')
            cartTbl.replaceChild(rowItem, itemExist)
          }
          
        }
        let [dollar, value] = document.getElementById('totalCost').textContent.split('$')
        document.getElementById('totalCost').textContent = `$${parseInt(value) + parseInt(data.itemNew.price)}`
      })
      document.getElementById('totalNum').textContent = parseInt(document.getElementById('totalNum').textContent) + 1

      let alertSuccess = document.createElement('div')
      alertSuccess.classList.add('alerts')
      alertSuccess.id = 'alertSuccess'
  
      let bodyAlert = document.createElement('div')
      bodyAlert.classList.add('alert')
      bodyAlert.classList.add('alert-success')
  
      let divIcon = document.createElement('div')
      divIcon.classList.add('icon', 'pull-left')
      divIcon.id = 'icon'
  
      let icon = document.createElement('i')
      icon.classList.add('fa', 'fa-check', 'fa-2x')
  
      let contentAlert = document.createElement('div')
      contentAlert.classList.add('copy')
      
      let headerContent = document.createElement('h4')
      headerContent.textContent = 'Success'
  
      let textAlert = document.createElement('p')
      textAlert.textContent = 'Add to cart'
  
      contentAlert.appendChild(headerContent)
      contentAlert.appendChild(textAlert)
  
      divIcon.appendChild(icon)
  
      bodyAlert.appendChild(divIcon)
      bodyAlert.appendChild(contentAlert)
  
      alertSuccess.appendChild(bodyAlert)
  
      if(document.getElementById('alertSuccess') === null) {
        document.body.appendChild(alertSuccess)
      } else {
        document.body.replaceChild(
          alertSuccess,
          [...document.body.children].find(element => {
            return [...element.classList].includes('alerts')
          }))
      }
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

function updateQuantityItem(input) {
  let preValue = input.defaultValue
  let currenValue = input.value

  let rowSelect = input.parentElement.parentElement
  let rowSelectId = rowSelect.id
  let [title, id_product] = rowSelectId.split('-')

  let listCookies = document.cookie.split(';')
  let currentUserId;
  
  listCookies.forEach(cookie => {
    
    if(cookie.includes('id')) {
      let [ name, value ] = cookie.split('=')
      
      currentUserId = value.trim()
    }
  })
  console.log(currentUserId, id_product)
  fetch(`https://shoppingapi-server.herokuapp.com/api/user/${currentUserId}/cart/update/${id_product}`, {
    method : 'POST',
    headers  : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      quantity : currenValue - preValue
    })
  })
    .then(res => res.json())
    .then(data => {
      // console.log(data)
      if(data.code === 200) {
        let cartTblMini = document.getElementById('cartTbl-mini');

        [...cartTblMini.children].forEach(row => {
          if(row.id === rowSelectId) {
            let listTextQty = row.children[1].querySelectorAll('p')

            console.log('1 :', listTextQty)
            let [qty, price] = listTextQty[1].textContent.trim().split('x')

            console.log('2 : ', qty , price)
            listTextQty[1].textContent = [data.item.qty, price].join(' x ')
          }
        })
        
        let totalCost = cartTblMini.parentElement.children[3]
        let orderSummary = document.getElementsByClassName('order-summary')

        let [dollar, value] = totalCost.textContent.split('$')

        dollar = '$'

        let [title, qty] = orderSummary[0].children[2].textContent.split('x')
        
        if(currenValue > preValue) {
          value = parseInt(value) + Math.abs(currenValue - preValue)*parseInt(data.item.price)
          qty = parseInt(qty) + Math.abs(currenValue - preValue)
        } else if(currenValue < preValue) {
          value = parseInt(value) - Math.abs(currenValue - preValue)*parseInt(data.item.price)
          qty = parseInt(qty) - Math.abs(currenValue - preValue)
        }
        
        let newValue = [dollar, value].join('')

        totalCost.textContent = orderSummary[0].children[3].textContent = newValue
        orderSummary[0].children[10].textContent = ['$',value + (value*10)/100].join('')

        
        orderSummary[0].children[2].textContent = [title, qty].join('x')
      }

      input.defaultValue = currenValue;
    })


}

window.onload = (ev) => {
    document.getElementById('subnav-space').addEventListener('mouseover', disableSroll)
    document.getElementById('subnav-space').addEventListener('mouseout', enableSroll)

    let itemNew = document.querySelector('.item-new');
    if(itemNew !== null) {
        itemNew.onclick = () => {
            return window.location =  '/product/all'
        }
    }

    let subnav_brand = document.getElementById('subnav-brand')
    let subnav_category = document.getElementById('subnav-category')

    fetch('https://shoppingapi-server.herokuapp.com/customer/brand')
    .then(async res => {
        let data = await res.json()
        let listGroup = subnav_brand.children[1]

        data.data.forEach(brand => {
            let rowBrand = document.createElement('li')
            let brandItem = document.createElement('a')
            brandItem.href = `/product/filter?id_brand=${brand.id}`
            brandItem.textContent = brand.name
            brandItem.style.textDecoration = 'none'
            brandItem.style.color = 'black'
            brandItem.style.letterSpacing = '1px'
            rowBrand.appendChild(brandItem)
            listGroup.appendChild(rowBrand)
        });
    })

    fetch('https://shoppingapi-server.herokuapp.com/customer/category')
    .then(async res => {
        let data = await res.json()
        let listGroup = subnav_category.children[1]

        data.data.forEach(category => {
            let rowCategory = document.createElement('li')
            let categoryItem = document.createElement('a')
            categoryItem.href = `/product/filter?id_category=${category.id}`
            categoryItem.textContent = category.name
            categoryItem.style.textDecoration = 'none'
            categoryItem.style.color = 'black'
            categoryItem.style.letterSpacing = '1px'
            rowCategory.appendChild(categoryItem)
            listGroup.appendChild(rowCategory)
        });
    })

    let categoryFilter = document.getElementById('categoryFilter')
    let brandFilter = document.getElementById('brandFilter')

    if(categoryFilter !== null && brandFilter !== null) {
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
    }

    let formFilterOrder = document.getElementById('formFilterOrder')
    
    if(formFilterOrder !== null) {
      let inputForm = formFilterOrder.querySelectorAll('input')

      inputForm.forEach(input => {
        input.onchange = (e) => {
          inputForm.forEach(i => {
            if(i.checked !== true) {
              (input.checked) ? i.disabled = true : i.disabled = false
            }
          })
        }
      })
  
      if(window.location.href.includes('account/my/order')) {
        inputForm.forEach(input => {
          if(input.checked !== true) {
            // console.log(input)
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

    let listCookies = document.cookie.split(';')
    let currentUserId;
    
    listCookies.forEach(cookie => {
      
      if(cookie.includes('id')) {
        let [ name, value ] = cookie.split('=')
        
        currentUserId = value.trim()
      }
    })

    let cartTblMini = document.getElementById('cartTbl-mini')
    fetch(`https://shoppingapi-server.herokuapp.com/api/user/${currentUserId}/get-cart`)
      .then(res => res.json())
      .then(data => {
        if(data.code === 200) {
          let totalCost = 0;
          data.data.forEach(item => {
            let rowItem = document.createElement('tr')
            rowItem.id = `product-${item.id}`
          
            let colImg = document.createElement('th')
            colImg.style.width = '20%'
            let imgItem = document.createElement('img')
            imgItem.src = item.image
            imgItem.style.width = imgItem.style.height = '100%'
            imgItem.style.objectFit = 'cover'
            imgItem.style.borderRadius = '.5rem'
            colImg.appendChild(imgItem)
  
            let colInformation = document.createElement('td')
            let nameItem = document.createElement('p')
            nameItem.textContent = item.name
            nameItem.style.marginBottom = '5px'
  
            let qtyItem = document.createElement('p')
            qtyItem.textContent =  `${item.qty} x $${item.price}`
            qtyItem.style.marginBottom = '0'
  
            colInformation.append(nameItem, qtyItem)
  
            let colDel = document.createElement('td')
            colDel.style.width = '15%'
            let btnDel = document.createElement('button')
            btnDel.classList.add('btn','btn-outline-dark')
            btnDel.type = 'button'
            btnDel.onclick = 'deleteItem(this)'
  
            let iconDel = document.createElement('i')
            iconDel.classList.add('fas','fa-trash')
  
            btnDel.appendChild(iconDel)
            colDel.appendChild(btnDel)
  
            rowItem.append(colImg, colInformation, colDel);

            cartTblMini.appendChild(rowItem)

            totalCost = totalCost + parseInt(item.qty)*parseInt(item.price)
          })
          document.getElementById('totalCost').textContent = `$${totalCost}`
          document.getElementById('totalNum').textContent = data.totalQty
          
          if(data.totalQty === 0) {
            let msgElement = document.createElement('h4')
            msgElement.id = 'empty-cart-msg'
            msgElement.textContent = 'Your cart is empty !'
            msgElement.style.marginTop = '.5rem'
            msgElement.style.marginLeft = '5px'
            msgElement.style.marginBottom = '0'
            msgElement.style.fontWeight = '600'
            msgElement.style.letterSpacing = '2px'

            let lineDivide = document.createElement('hr')
            lineDivide.style.all = "unset"
            
            cartTblMini.parentElement.prepend(lineDivide)
            cartTblMini.parentElement.prepend(msgElement)
          }
        }
      })
    
    // if(window.location.href.includes('cart')) {
    //   let cartTblNormal = document.getElementById('cartTbl')

    //   fetch(`https://shoppingapi-server.herokuapp.com/api/user/${currentUserId}/get-cart`)
    //     .then(response => response.json())
    //     .then(data => {
    //       if(data.code === 200) {
    //         data.data.forEach(item => {
              
    //           let rowItem = document.createElement('tr')
        
    //           let colImg = document.createElement('th')
    //           let imgItem = document.createElement('img')
    //           imgItem.src = item.image
    //           imgItem.style.width = imgItem.style.height = '100%'
    //           imgItem.style.objectFit = 'cover'
    //           imgItem.style.borderRadius = '.5rem'
    //           colImg.appendChild(imgItem)
    
    //           let colInformation = document.createElement('td')
    //           let nameItem = document.createElement('h5')
    //           nameItem.textContent = item.name
    
    //           let idItem = document.createElement('p')
    //           idItem.textContent = `#${item.id}`
    
    //           colInformation.append(nameItem, idItem)
    
    //           let colQty = document.createElement('td')
    //           let qtyItem = document.createElement('input')
    //           qtyItem.type = 'number'
    //           qtyItem.id = 'quantity'
    //           qtyItem.step = '1'
    //           qtyItem.style.height = '37px'
    //           qtyItem.style.transform = 'translateY(2.5px)'
    //           qtyItem.value = parseInt(item.qty)*parseInt(item.price)
    //           qtyItem.onchange = "updateQuantityItem(this)"
    
    //           let btnDel = document.createElement('button')
    //           btnDel.classList.add('btn', 'btn-outline-dark')
    //           btnDel.type = 'button'
    //           btnDel.style.marginLeft = '10px'
    //           btnDel.onclick = "deleteItem(this)"
    
    //           colQty.append(qtyItem, btnDel)
    
    //           let iconTrash = document.createElement('i')
    //           iconTrash.classList.add('fas', 'fa-trash')
    
    //           btnDel.append(iconTrash)
    
    //           let colPrice = document.createElement('td')
    //           colPrice.textContent = item.price
    
    
    //           rowItem.append(
    //             colImg,
    //             colInformation,
    //             colQty,
    //             colPrice
    //           );
              
    //           cartTblNormal.children[0].appendChild(rowItem)
              
    //         })
    //       }
    //     })
    // }
}