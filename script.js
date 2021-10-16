const BASE_PRICE = 10000
const COMPANY_PRICE = 5000
const USER_PRICE = 500
const BANDWIDTH_PRICE = 1.5
const DISCOUNT_PERCENTAGE = 0.05
const VAT = 0.20

document.querySelector('.btn-submit').addEventListener('click', (event) => {
    event.preventDefault()

    let numUsers = parseInt(document.querySelector('#num-users').value)
    let numCompanies = parseInt(document.querySelector('#num-companies').value)
    let bandwidth = parseFloat(document.querySelector('#bandwidth').value)

    // Some input validation
    if (isNaN(numUsers) || isNaN(numCompanies) || isNaN(bandwidth)) {
        let message = `<p style="font-style: italic; color: red;">Invalid Input!</p>`
        returnMessage(message)

    } else if (numUsers > 100) {
        let message = `<p style="font-style: italic; color: orange;">Capacity Reached: Please contact the sales team</p>`
        returnMessage(message)
        
    } else {
        let totalPrice = calculatePrice(numUsers, numCompanies, bandwidth)
        printResults(totalPrice)
        let graphData = generateGraphData(numUsers, numCompanies, bandwidth, totalPrice)
        generateGraph(graphData, totalPrice)
        document.querySelector('form').reset()
    }
});

/*====================
    PART ONE
======================*/
function calculatePrice(numUsers, numCompanies, bandwidth) {
    let freeUsers = numCompanies * 3 // Each company gets 3 free users
    let totalUserPrice = ((numUsers - freeUsers) * USER_PRICE)
    let totalCompanyPrice = (numCompanies * COMPANY_PRICE)
    let totalBandWidthPrice = (bandwidth * BANDWIDTH_PRICE) * numUsers // Assuming the bandwidth entered is per user
    let totalPrice = BASE_PRICE + totalUserPrice + totalCompanyPrice + totalBandWidthPrice

    // If there are over 30 users, discount is applied and BASE_PRICE is removed
    if (numUsers > 30) {
        let eligibleDiscount = parseInt(numUsers / 30)
        totalPrice += (eligibleDiscount * DISCOUNT_PERCENTAGE)
        totalPrice -= BASE_PRICE
    }
    return totalPrice
}

function printResults(totalPrice) {
    let totalWithVat = totalPrice + (totalPrice * VAT)
    document.querySelector('.screen').innerHTML = ""
    document.querySelector('.screen').innerHTML +=
        `Total Price exc VAT: £${totalPrice.toFixed(2)}<br><br>
    Total Price inc VAT: £${totalWithVat.toFixed(2)}`
}


/*====================
    PART TWO:
======================*/
function generateGraphData(numUsers, numCompanies, bandwidth, totalPrice) {
    let data = []

    // Adding the inputted number of users for the graph to generate a marker
    data.push({ x: Number(numUsers), y: totalPrice, indexLabel: "\u2193 Current Users", 
        markerColor: "green", markerType: "circle", markerSize: 20 })

    for (i = 0; i <= 100; i += 10) {
         currentUserNum = calculatePrice(i, numCompanies, bandwidth)
         console.log(i, numCompanies, bandwidth)
         data.push({ x: i, y: Number(currentUserNum.toFixed(2)) })
     }

     // Sorting the data by the number of users, since the inputted data was entered first
     data.sort((a, b) => a.x - b.x)
       
       console.log(data)
       return data
}

function generateGraph(graphData) {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Pricing Calculator Graph"
        },
        axisX:{
            title: "Number of Users",
            gridThickness: 1,
            tickLength: 10
           },
           axisY:{
            title: "Price",
            gridThickness: 1,
            tickLength: 10, 
            prefix: "£"
           },
        data: [{
            type: "line",
            indexLabelFontSize: 16,
            dataPoints: graphData
        }]
    });
    chart.render();
}

function returnMessage(message) {
    document.querySelector('.screen').innerHTML = message
    setTimeout(() => {
       document.querySelector('.screen').innerHTML = "" 
    }, 2000); 
}