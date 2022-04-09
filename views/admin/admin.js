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

const enableBtn = (inputId) => {
    let inputElement = document.getElementById(inputId)

    let [general, number] = inputId.split('-')

    console.log(inputElement,number)
    let btnElement = document.getElementById(`btnUpdate-${number}`)
    console.log(btnElement)
    return btnElement.disabled = false
}


window.onload = (e) => {
    const searchURL = window.location.href

    if(searchURL.includes('search')) {
        document.getElementsByClassName('body-page')[0].style.transform = "translateY(-1rem)";
    }
}

google.charts.load('current',{packages:['corechart']});

google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    let listCookies = document.cookie.split(';')
    listCookies.forEach(cookie => {
    
        if(cookie.includes('token')) {
          let [ name, value ] = cookie.split('=')
          
          token = value.trim()
        }
      })

    fetch('https://shoppingapi-server.herokuapp.com/report/product', {
        method : 'GET',
        headers  : {
          'token' : token || ''
        }
    })
        .then(response => response.json())
        .then(data => {
            if(data.code === 200) {   
                let dataForVisualize = []
                dataForVisualize.push(['Name', 'Sum'])

                data.data.forEach(product => {
                    dataForVisualize.push([product.name, Number(product.sum)])
                })

                // console.log(dataForVisualize)

                let dataVisualize = google.visualization.arrayToDataTable(dataForVisualize);
                
                let options = {
                    title: 'Product Report'
                };
                
                let chart = new google.visualization.BarChart(document.getElementById('productChart'));
                chart.draw(dataVisualize, options);
            }
        })


        fetch('https://shoppingapi-server.herokuapp.com/report/order', {
            method : 'GET',
            headers  : {
              'token' : token || ''
            }
        })
            .then(response => response.json())
            .then(data => {
                if(data.code === 200) {   
                    let dataForVisualize = []
                    dataForVisualize.push(['Status', 'Sum'])
    
                    data.data.forEach(order => {
                        let date = toDateName(order.date_trunc)
                        console.log(date)
                        dataForVisualize.push([[capitalize(order.status),'(', date , ')'].join(''), Number(order.count)])
                    })
    
                    // console.log(dataForVisualize)
    
                    let dataVisualize = google.visualization.arrayToDataTable(dataForVisualize);
                    
                    let options = {
                        title: 'Order Report'
                    };
                    
                    let chart = new google.visualization.BarChart(document.getElementById('orderChart'));
                    chart.draw(dataVisualize, options);
                }
            })
}

window.onload = (e) => {
    if(window.location.href.includes('dashboard')) {
        let listCookies = document.cookie.split(';')
        listCookies.forEach(cookie => {
        
            if(cookie.includes('token')) {
              let [ name, value ] = cookie.split('=')
              
              token = value.trim()
            }
          })
        fetch('https://shoppingapi-server.herokuapp.com/report/order', {
            method : 'GET',
            headers  : {
              'token' : token || ''
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) {
                let totalOrder = 0

                data.data.forEach(order => {
                    totalOrder += parseInt(order.count)
                })

                let totalOrderElement = document.createElement('h3')
                totalOrderElement.textContent = [totalOrder, 'orders'].join(' ')

                totalOrderElement.style.marginBottom = 'unset'

                document.getElementById('order-report').appendChild(totalOrderElement)

                let pendingOrder = data.data.filter(order => {
                    return order.status == 'pending'
                })

                let totalPendingOrder = pendingOrder.reduce((total, order) => {
                    return total + parseInt(order.count)
                }, 0)

                let pendingOrderElement = totalOrderElement.cloneNode(true)
                pendingOrderElement.textContent = [totalPendingOrder, 'orders'].join(' ')

                document.getElementById('order-pending-report').appendChild(pendingOrderElement)

                let currentSalesData = data.data.map(order => {
                    let { status, count , date_trunc } = order
                    
                    let dataForRender = {
                        status : capitalize(status),
                        count : parseInt(count),
                        date : toDateName(date_trunc)
                    }

                    return dataForRender
                })

                let tableElement = document.createElement('table')
                tableElement.classList.add('table')
                tableElement.classList.add('table-striped')


                let headTable = document.createElement('thead')
                let rowHead = document.createElement('tr')
                let thElement = document.createElement('th')
                thElement.scope = 'col'

                let statusCol = thElement.cloneNode(true)
                statusCol.textContent = 'Status'

                let countCol = thElement.cloneNode(true)
                countCol.textContent = 'Count'

                let dateCol = thElement
                dateCol.textContent = 'Date'

                rowHead.append(statusCol, countCol, dateCol)
                headTable.appendChild(rowHead)
                headTable.classList.add('table-dark')
                tableElement.appendChild(headTable)

                let bodyTable = document.createElement('tbody')

                currentSalesData.forEach(order => {
                    let rowElement = document.createElement('tr')
                    let statusCell = document.createElement('td')
                    statusCell.textContent = order.status

                    let countCell = document.createElement('td')
                    countCell.textContent = order.count

                    let dateCell = document.createElement('td')
                    dateCell.textContent = order.date

                    rowElement.append(statusCell, countCell, dateCell)
                    bodyTable.appendChild(rowElement)
                })

                tableElement.appendChild(bodyTable)
                tableElement.style.overflowY = 'auto'

                document.getElementById('current-sale').appendChild(tableElement)
            }
        })

        fetch('https://shoppingapi-server.herokuapp.com/report/product', {
            method : 'GET',
            headers  : {
              'token' : token || ''
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) {
                let totalProductSale = data.data.reduce((total, product) => {
                    return total + parseInt(product.sum)
                }, 0)

                let totalProductSaleElement = document.createElement('h3')
                totalProductSaleElement.textContent = [totalProductSale, 'products'].join(' ')

                totalProductSaleElement.style.marginBottom = 'unset'

                document.getElementById('product-report').appendChild(totalProductSaleElement)
            }
        })

        fetch('https://shoppingapi-server.herokuapp.com/report/revenue/1', {
            method : 'GET',
            headers  : {
              'token' : token || ''
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) {
                let totalSales = parseInt(data.data[0].sum)
                let monthCloset = data.data[0].date_part

                let totalSalesElement = document.createElement('h3')
                totalSalesElement.textContent = ['$', totalSales].join('')

                let monthClosetElement = document.createElement('p')

                monthCloset = toMonthName(monthCloset)
                monthClosetElement.textContent = `From Last ${monthCloset}`
                monthClosetElement.style.position = 'absolute'
                monthClosetElement.style.bottom = '0px'
                monthClosetElement.style.left = '20px'
                monthClosetElement.style.marginBottom = 'unset'
                monthClosetElement.style.fontSize = '14px'

                document.getElementById('revenue-report').append(totalSalesElement, monthClosetElement)
            }
        })
    }

    document.getElementById('btn-close-sidebar').addEventListener('click', () => {
        if(document.getElementById('sidebar-space').style.transform == 'translateX(-100%)') {
            document.getElementById('sidebar-space').style.transform = 'unset'
            document.getElementById('main-content').style.marginLeft = 'unset'
            document.getElementById('btn-close-sidebar').style.transform = 'unset'
        } else {
            document.getElementById('sidebar-space').style.transform = 'translateX(-100%)'
            document.getElementById('main-content').style.marginLeft = '-280px'
            document.getElementById('btn-close-sidebar').style.transform = 'rotate(90deg)'
        }
    })
}

function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {
      month: 'long',
    });
  }

function toDateName(timestamp) {
    const date = new Date(timestamp)

    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
}

function capitalize(word) {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
  }