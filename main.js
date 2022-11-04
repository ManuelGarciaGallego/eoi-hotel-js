const saludo = [{ texto: "¡Buenos días!", color: "#9ab755" }, { texto: "¡Buenas tardes!", color: "#7e3333" }, { texto: "¡Buenas noches!", color: "#335" }];

function fillValue(key, value) {
    const node = document.querySelector(key);
    node.innerHTML = node && value; // cláusula de guarda
}

function changeColor(key, color) {
    const node = document.querySelector(key);
    node.style.backgroundColor = node && color; // cláusula de guarda
}

function getSaludo() {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 22 || hour < 6) {
        return saludo[2];

        git
    } else if (hour < 14) {
        return saludo[0];
    } else {
        return saludo[1];
    }
}

function fillHTML(data) {
    fillValue("#header-title", data.header.title);
    fillValue("#header-description", data.header.description);
    fillValue("#history-title", data.history.title);
    fillValue("#history-description", data.history.description);
    fillValue("#location-title", data.location.title);
    fillValue("#location-description", data.location.description);
    fillValue("#meals-title", data.meals.title);
    fillValue("#meals-description", data.meals.description);
    fillValue("#fitness-title", data.fitness.title);
    fillValue("#fitness-description", data.fitness.description);
    fillValue("#footer-text", data.footer.text);
    const saludo = getSaludo();
    fillValue('.saludo', saludo.texto);
    changeColor('.navbar', saludo.color);
}

fetch('https://practica-eoi.alexdw.com/contents')
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {
        console.log('data = ', data);
        const json = JSON.parse(data);
        fillHTML(json);
    })
    .catch(function (err) {
        console.error(err);
    });

function formatFecha(fecha) {
    let date = new Date(fecha)
    let day = `${(date.getDate())}`.padStart(2, '0');
    let month = `${(date.getMonth() + 1)}`.padStart(2, '0');
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function procesarReserva(noches) {
    const desde = formatFecha(noches[0].date);
    const hasta = formatFecha(noches[noches.length - 1].date);
    alert(`Chek-in realizado con éxito para su reserva desde ${desde} hasta ${hasta}`);
}

function avisarDeuda(noches) {
    const deuda = noches.reduce((previo, noche) => previo + noche.price, 0);
    alert(`La reserva aún no ha sido abonada, tendrá que abonar ${deuda} € en su entada al hotel`);
}


function reserva(event) {
    event.preventDefault();
    console.log(event.target.elements.orderId.value);
    fetch('https://practica-eoi.alexdw.com/reservations', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            orderId: event.target.elements.orderId.value,
            lastname: event.target.elements.lastname.value
        })
    })
        .then(response => {
            // console.log (response);
            return response.json()
        })
        .then(data => {
            console.log(JSON.stringify(data));
            if (data.error) {
                alert('Datos incorrectos, inténtalo de nuevo más tarde')
            } else {
                procesarReserva(data.reservations.nights);
                if (!data.reservations.paid) {
                    avisarDeuda(data.reservations.nights)
                }
            }
        })
        .then(terminado => {
            console.log('End of sending');
        });

    // axios({
    //     method: 'post',
    //     url: 'https://practica-eoi.alexdw.com/reservations',
    //     data: {
    //           orderId: event.target.elements.orderId.value,
    //           lastname: event.target.elements.lastname.value,
    //     }
    // })
}

const modal = document.getElementById('dialogo');
const openModal = document.getElementById('open-modal');
const closeModal = document.getElementById('formularioCheking');

openModal.addEventListener("click", event => {
    modal.showModal();
});

closeModal.addEventListener("submit", event => {
    reserva(event);
    modal.close();
})

fetch('https://practica-eoi.alexdw.com/contents')
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {
        console.log('data = ', data);
        const json = JSON.parse(data);
        fillHTML(json);
    })
    .catch(function (err) {
        console.error(err);
    });

// import datosPrueba from './reserva.json' assert {type: 'json'};
// avisarDeuda (datosPrueba.reservations.nights);
