const vehiculo = {
  ruedas: true,
  volante: 1,
  motor: '8v'
}

const auto = {
  ruedas: 4
}

Object.setPrototypeOf(auto, vehiculo)
console.log(auto.ruedas, auto.volante, auto.motor)

// delete auto.ruedas
// console.log(auto.ruedas, auto.volante, auto.motor)

// delete auto.ruedas
// console.log(auto.ruedas, auto.volante, auto.motor)
