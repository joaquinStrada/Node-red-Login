(function () {
  /*-----------------------------------*/
  /* variables */
  /*-----------------------------------*/
  var btn_agregar = document.getElementById("agregar");
  var btn_modificar = document.getElementById("modificar");
  var btn_eliminar = document.getElementById("eliminar");
  var tabla = document.getElementById("tabla");
  var plantilla_tabla = document.getElementById("plantilla_tabla");
  var contenedor_alerta = document.getElementById("contenedor_alerta");
  var formulario = document.getElementById("formulario");
  var btn_frm_agregar = document.getElementById("frm_agregar");
  var btn_frm_cancelar = document.getElementById("frm_cancelar");
  var alerta = document.getElementById("alerta");
  var btn_si = document.getElementById("si");
  var btn_no = document.getElementById("no");
  var proposito_formulario = "";
  var checkbox_selected = undefined;
  /*-----------------------------------*/
  /* eventos */
  /*-----------------------------------*/
  btn_agregar.addEventListener("click", function () {
    btn_frm_agregar.setAttribute('class', "frm_agregar")
    btn_frm_agregar.innerHTML = "<i class='fas fa-plus'></i>Agregar";
    formulario.classList.add("active");
    contenedor_alerta.classList.add("active");
    formulario.elements.namedItem("usuario").disabled = false;
    proposito_formulario = "agregar";
  });
  btn_modificar.addEventListener("click", function () {
    btn_frm_agregar.setAttribute('class', "frm_modificar")
    btn_frm_agregar.innerHTML = "<i class='far fa-edit'></i>Modifiar";
    formulario.classList.add("active");
    contenedor_alerta.classList.add("active");

    // rellenamos el formulario con los datos del usuario a modificar
    rellenar_formulario();

    // indicamos cual es el proposito del formulario
    proposito_formulario = "modificar";
  });
  btn_eliminar.addEventListener("click", function () {
    alerta.classList.add("active");
    contenedor_alerta.classList.add("active");
  });
  btn_si.addEventListener("click", function () {
    eliminar_usuario();
  });
  btn_no.addEventListener("click", function () {
    alerta.classList.remove("active");
    contenedor_alerta.classList.remove("active");
  });
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validar_campos()) {
      var datos = new FormData(formulario);
      var options = {
        method: 'POST',
        body: datos
      };
      if (proposito_formulario == "agregar") {
        agregar_usuario(options);
      } else {
        modificar_usuario(options);
      }
    }
  });
  btn_frm_cancelar.addEventListener("click", function () {
    contenedor_alerta.classList.remove("active");
    formulario.classList.remove("active");
    proposito_formulario = "";
  });
  window.addEventListener("load", function () {
    plantilla_tabla = plantilla_tabla.content;
    traer_datos();
  });
  /*-----------------------------------*/
  /* funciones */
  /*-----------------------------------*/
  function validar_campos() {
    // creamos el objeto campos dependiendo del proposito del formulario
    var campos;
    if (proposito_formulario == "agregar") {
      campos = document.querySelectorAll(".formulario input, select");
    } else {
      campos = document.querySelectorAll(".formulario input[type='text'], select");
    }
    // restablecemos todos los campos
    restablecer();
    // validamos que todos los campos esten llenos
    for (var campo of campos) {
      if (campo.value == 0) {
        var padre = campo.parentNode;
        padre.classList.add("error");
        var texto = generar_texto(campo);
        toastr.error(texto);
        return false;
      }
    }
    if (validar_passwords() == false) {
      return false;
    }
    return true;
  }
  function validar_passwords() {
    var pass = formulario.elements.namedItem("pass");
    var rpass = formulario.elements.namedItem("rpass");
    if (rpass.value != pass.value) {
      pass.parentNode.classList.add("error");
      rpass.parentNode.classList.add("error");
      toastr.error("Las Contraseñas deben Coincidir");
      return false;
    }
    return true;
  }
  function generar_texto(campo) {
    var placeholder = campo.placeholder;
    var array_placeholder = placeholder.split(" ");
    var texto = "Debe rellenar el campo: ";
    for (var i = 1; i < array_placeholder.length; i++) {
      texto += array_placeholder[i] + " ";
    }
    texto = texto.trim();
    return texto;
  }
  function restablecer() {
    var campos = document.querySelectorAll(".formulario input, select");
    for (var campo of campos) {
      var padre = campo.parentNode;
      if (padre.classList.contains("error")) {
        padre.classList.remove("error");
      }
    }
  }
  function agregar_usuario(options) {
    fetch("php/agregar.php", options)
    .then(res => res.json())
    .then(data => {
      if (data[0] == false && data[1] == "El usuario ya esta registrado en la bd") {
        var input_usuario = formulario.elements.namedItem("usuario");
        var padre = input_usuario.parentNode;
        padre.classList.add("error");
        toastr.error(data[1]);
      } else if (data[0] == false) {
        toastr.error(data[1]);
      } else if (data[0] == true) {
        toastr.success(data[1]);
        traer_datos();
      } else {
        console.log(data);
      }
    })
  }
  function modificar_usuario(options) {
    options.body.append('id', checkbox_selected.id);
    fetch("php/modificar.php", options)
    .then(res => res.json())
    .then(data => {
      if (data[0] == true) {
        toastr.success(data[1]);
        traer_datos();
        contenedor_alerta.classList.remove("active");
        formulario.classList.remove("active");
        proposito_formulario = "";
      } else {
        toastr.error(data[1]);
      }
    })
  }
  function traer_datos() {
    fetch("php/traer_datos.php")
    .then(res => res.json())
    .then(data => {
      if (data[0] == false) {
        toastr.error(data[1]);
      } else {
        actualizar_tabla(data);
      }
    });
  }
  function actualizar_tabla(data) {
    var fragment = document.createDocumentFragment();
    tabla.innerHTML = "";
    for (var row of data) {
      var clone = plantilla_tabla.cloneNode(true);

      // creamos el checkbox de seleccion de usuario
      clone.querySelector("td input").setAttribute('id', row.id);
      clone.querySelector("td label").setAttribute('for', row.id);
      clone.querySelector("td input").addEventListener("change", usuario_seleccionado);

      // creamos las demas celdas para los diferentes datos
      var tds = clone.querySelectorAll("td");
      tds[1].textContent = row.id;
      tds[2].textContent = row.fechayhora;
      tds[3].textContent = row.username;

      // ponemos los permisos del usuario en su respectiva celda
      if (row.permissions == "*") {
        clone.querySelector("td p").setAttribute('class', "admin");
        clone.querySelector("td p").textContent = "Administrador";
      } else {
        clone.querySelector("td p").setAttribute('class', "read");
        clone.querySelector("td p").textContent = "Lectura";
      }

      // adjuntamos la row al fragment
      fragment.appendChild(clone);
    }
    tabla.appendChild(fragment);

    // ocultamos los botones de eliminar y modificar
    btn_modificar.classList.remove("active");
    btn_eliminar.classList.remove("active");
  }
  function usuario_seleccionado() {
    if (this.checked == true && typeof checkbox_selected != 'undefined') {
      checkbox_selected.checked = false;
      btn_modificar.classList.add("active");
      btn_eliminar.classList.add("active");
      checkbox_selected = this;
    } else if (this.checked == true) {
      btn_modificar.classList.add("active");
      btn_eliminar.classList.add("active");
      checkbox_selected = this;
    } else if (this.checked == false && typeof checkbox_selected != undefined) {
      btn_modificar.classList.remove("active");
      btn_eliminar.classList.remove("active");
      checkbox_selected = undefined;
    }
  }
  function rellenar_formulario() {
    var padre = checkbox_selected.parentNode;
    var abuelo = padre.parentNode;
    var tds_usuario = abuelo.querySelectorAll("td");
    formulario.elements.namedItem("usuario").value = tds_usuario[3].innerHTML;
    formulario.elements.namedItem("usuario").disabled = true;

    formulario.elements.namedItem("pass").value = "";
    formulario.elements.namedItem("rpass").value = "";

    var permiso_usuario = abuelo.querySelector("td p").innerHTML;
    if (permiso_usuario == "Lectura") {
      formulario.elements.namedItem("permits").value = "read";
    } else {
      formulario.elements.namedItem("permits").value = "*";
    }
  }
  function eliminar_usuario() {
    var id_usuario = checkbox_selected.id;
    var datos = new FormData();
    datos.append('id', id_usuario);

    var options = {
      method: 'POST',
      body: datos
    };

    fetch("php/eliminar.php", options)
    .then(res => res.json())
    .then(data => {
      if (data[0] == true) {
        toastr.success(data[1]);
        alerta.classList.remove("active");
        contenedor_alerta.classList.remove("active");
        traer_datos();
      } else {
        toastr.error(data[1]);
      }
    })
  }
}())
