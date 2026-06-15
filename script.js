$(document).ready(function() {

  if (localStorage.getItem('saldo') === null) {
    localStorage.setItem('saldo', 0);
  }

  $('#loginForm').submit(function(event) {
    event.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    if (email === 'edoc@gmail.com' && password === '963852') {
      $('#alert-container').html('<div class="alert alert-success mt-3">Inicio de sesión exitoso. Redirigiendo...</div>');

      setTimeout(function() {
        window.location.href = 'menu.html';
      }, 1500);
    } else {
      $('#alert-container').html('<div class="alert alert-danger mt-3">Usuario o contraseña inválidos. Inténtalo nuevamente.</div>');
    }
  });

if ($('#balance').length) {
  var saldoMenu = parseFloat(localStorage.getItem('saldo')) || 0;

  $('#balance').text(
    saldoMenu.toLocaleString('es-CL')
  );
}

  $('#btnDepositar').click(function() {
    $('#mensajeMenu').html('<div class="alert alert-info mt-3">Redirigiendo a depósito...</div>');
    setTimeout(function() {
      window.location.href = 'deposit.html';
    }, 1500);
  });

  $('#btnEnviarDinero').click(function() {
    $('#mensajeMenu').html('<div class="alert alert-success mt-3">Redirigiendo a enviar dinero...</div>');
    setTimeout(function() {
      window.location.href = 'sendmoney.html';
    }, 1500);
  });

  $('#btnMovimientos').click(function() {
    $('#mensajeMenu').html('<div class="alert alert-primary mt-3">Redirigiendo a últimos movimientos...</div>');
    setTimeout(function() {
      window.location.href = 'transactions.html';
    }, 1500);
  });

$('#btnCerrarSesion').click(function() {

  if (confirm('¿Desea cerrar sesión?')) {

    window.location.href = 'index.html';

  }

});

var saldoActual = parseFloat(localStorage.getItem('saldo')) || 0;




$('#saldoActual').text(
    saldoActual.toLocaleString('es-CL')
);

  $('#btnRealizarDeposito').click(function() {
    var monto = parseFloat($('#montoDeposito').val());
    var moneda = $('#monedaDeposito').val();
    var saldoActual = parseFloat(localStorage.getItem('saldo'));

    if (!isNaN(monto) && monto > 0) {
      var nuevoSaldo = saldoActual + monto;
      localStorage.setItem('saldo', nuevoSaldo);

      var movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];
      movimientos.push({
  tipo: 'deposito',
  monto: monto,
  moneda: moneda
});
      localStorage.setItem('movimientos', JSON.stringify(movimientos));

$('#saldoActual').text(
    nuevoSaldo.toLocaleString('es-CL')
);

$('#mensajeDeposito').html(
  ' Depósito realizado por $' +
  monto.toLocaleString('es-CL')
);

      setTimeout(function() {
        window.location.href = 'menu.html';
      }, 1500);
    } else {
      $('#alert-container').html('<div class="alert alert-danger mt-3">Ingrese un monto válido.</div>');
    }
  });

  var saldoEnvio = parseFloat(localStorage.getItem('saldo')) || 0;

$('#saldoEnvio').text(
    saldoEnvio.toLocaleString('es-CL')
);

  $('#btnMostrarContacto').click(function() {
    $('#formContacto').show();
  });

  $('#btnCancelarContacto').click(function() {
    $('#formContacto').hide();
  });

  $('#btnGuardarContacto').click(function() {
  var nombre = $('#nombreContacto').val();
  var rut = $('#rutContacto').val();
  var email = $('#emailContacto').val();
  var numero = $('#numeroContacto').val();
  var banco = $('#bancoContacto').val();

  if (nombre === '' || rut === '' || email === '' || numero === '' || banco === '') {
    $('#alert-container').html('<div class="alert alert-danger mt-3">Complete todos los campos del contacto.</div>');
    return;
  }

  if (numero.length < 5) {
    $('#alert-container').html('<div class="alert alert-danger mt-3">El número de cuenta debe tener al menos 5 dígitos.</div>');
    return;
  }

  var contactos = JSON.parse(localStorage.getItem('contactos')) || [];

  contactos.push({
    nombre: nombre,
    rut: rut,
    email: email,
    numero: numero,
    banco: banco
  });

  localStorage.setItem('contactos', JSON.stringify(contactos));

  $('#listaContactos').append(
    '<option value="' + nombre + '">' + nombre + ' - ' + banco + '</option>'
  );

  $('#nombreContacto').val('');
  $('#rutContacto').val('');
  $('#emailContacto').val('');
  $('#numeroContacto').val('');
  $('#bancoContacto').val('');

  $('#formContacto').hide();

  $('#alert-container').html('<div class="alert alert-success mt-3">Contacto agregado correctamente.</div>');
});

$('#listaContactos').change(function() {
  if ($(this).val() !== '') {
    $('#btnEnviarMonto').show();
  } else {
    $('#btnEnviarMonto').hide();
  }
});

$('#btnEnviarMonto').click(function() {
  var monto = parseFloat($('#montoEnviar').val());
  var saldo = parseFloat(localStorage.getItem('saldo')) || 0;
  var contacto = $('#listaContactos').val();

  if (contacto === '') {
    $('#alert-container').html('<div class="alert alert-danger mt-3">Seleccione un contacto.</div>');
    return;
  }

  if (isNaN(monto) || monto <= 0) {
    $('#alert-container').html('<div class="alert alert-danger mt-3">Ingrese un monto válido.</div>');
    return;
  }

  if (monto > saldo) {
    $('#alert-container').html('<div class="alert alert-danger mt-3">Saldo insuficiente.</div>');
    return;
  }

  var nuevoSaldo = saldo - monto;
  localStorage.setItem('saldo', nuevoSaldo);

  var movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];

  movimientos.push({
    tipo: 'transferencia',
    monto: monto
  });

  localStorage.setItem('movimientos', JSON.stringify(movimientos));

  $('#saldoEnvio').text(nuevoSaldo.toLocaleString('es-CL'));

  $('#mensajeEnvio').html(
    'Transferencia realizada correctamente a ' +
    contacto +
    ' por $' +
    monto.toLocaleString('es-CL')
  );

  $('#alert-container').html('<div class="alert alert-success mt-3">Dinero enviado correctamente.</div>');
});

    function mostrarUltimosMovimientos(filtro) {
    var movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];
    $('#listaMovimientos').empty();

if (movimientos.length === 0) {
  $('#listaMovimientos').append(
    '<li class="list-group-item">No hay movimientos registrados.</li>'
  );
  return;
}

    movimientos.forEach(function(movimiento) {
      if (filtro === 'todos' || movimiento.tipo === filtro) {
var tipoTexto = movimiento.tipo === 'deposito'
    ? 'Depósito'
    : 'Transferencia';

var montoFormateado = Number(movimiento.monto).toLocaleString('es-CL');

$('#listaMovimientos').append(
    '<li class="list-group-item movimiento-item">' +
        '<span>' + tipoTexto + '</span>' +
       '<strong>CLP $' + montoFormateado + '</strong>' + 
        '</li>'
);
      }
    });
  }

  mostrarUltimosMovimientos('todos');

  $('#filtroMovimientos').change(function() {
    var filtro = $(this).val();
    mostrarUltimosMovimientos(filtro);
  });

$('#buscarContacto').keyup(function() {
  var textoBusqueda = $(this).val().toLowerCase();
  var contactos = JSON.parse(localStorage.getItem('contactos')) || [];

  $('#listaContactos').empty();
  $('#listaContactos').append('<option value="">Seleccione un contacto</option>');

  contactos.forEach(function(contacto) {
  var nombre = contacto.nombre.toLowerCase();
var banco = contacto.banco.toLowerCase();

if (nombre.includes(textoBusqueda) || banco.includes(textoBusqueda)) {  
      $('#listaContactos').append(
'<option value="' + contacto.nombre + '">' + contacto.nombre + ' - ' + contacto.banco + '</option>'      );
    }
  });
});

});

