const tabela = document.getElementById('tabela')

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
socket.binaryType = 'arraybuffer';

niz.forEach(p => {
    const red = document.createElement('tr')

    const id = document.createElement('td')
    const temp = document.createElement('td')
    const vlaznost = document.createElement('td')
    const pm2_5 = document.createElement('td')
    const pm10 = document.createElement('td')
    
    id.innerText = `${p.Id}`
    temp.innerText = `${p.Temperatura.toFixed(2)} °C`
    if (p.Temperatura > 20.0) {
        temp.classList.add('prevelika-vrednost')
    }

    vlaznost.innerText = `${p.Vlaznost.toFixed(2)} %`
    if (p.Vlaznost < 48.0) {
        vlaznost.classList.add('prevelika-vrednost')
    }

    pm2_5.innerText = `${p.Pm2_5.toFixed(2)} µg/m³`
    if (p.Id % 5 == 0) {
        pm2_5.classList.add('prevelika-vrednost')
    }

    pm10.innerText = `${p.Pm10.toFixed(2)} µg/m³`
    if (p.Pm10 < 15.0) {
        pm10.classList.add('prevelika-vrednost')
    }

    red.appendChild(id)
    red.appendChild(temp)
    red.appendChild(vlaznost)
    red.appendChild(pm2_5)
    red.appendChild(pm10)

    tabela.appendChild(red)
});


socket.onopen = (e) => {
    console.log('povezan')
} 

socket.onmessage = (e) => {
    const data = new Uint8Array(e.data)
    let str = ""

    data.forEach(p => {
        str += String.fromCharCode(parseInt(p))
    })

    const obj = JSON.parse(str.slice(1))
    
    const novoPolje = document.createElement('div')
    novoPolje.classList.add('polje')

    const red = document.createElement('tr')

    const id = document.createElement('td')
    const temp = document.createElement('td')
    const vlaznost = document.createElement('td')
    const pm2_5 = document.createElement('td')
    const pm10 = document.createElement('td')
    
    id.innerText = `${obj.Id}`
    temp.innerText = `${obj.Temperatura.toFixed(2)} °C`
    if (obj.Temperatura > 60.0) {
        temp.classList.add('prevelika-vrednost')
    }

    vlaznost.innerText = `${obj.Vlaznost.toFixed(2)} %`
    if (obj.Vlaznost > 80.0) {
        vlaznost.classList.add('prevelika-vrednost')
    }

    pm2_5.innerText = `${obj.Pm2_5.toFixed(2)} µg/m³`
    if (obj.Pm2_5 > 55.0) {
        pm2_5.classList.add('prevelika-vrednost')
    }

    pm10.innerText = `${obj.Pm10.toFixed(2)} µg/m³`
    if (obj.Pm10 > 253.0) {
        pm10.classList.add('prevelika-vrednost')
    }

    red.appendChild(id)
    red.appendChild(temp)
    red.appendChild(vlaznost)
    red.appendChild(pm2_5)
    red.appendChild(pm10)

    tabela.appendChild(red)
}
