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
      }, 2000);
    } else {
      $('#alert-container').html('<div class="alert alert-danger mt-3">Usuario o contraseña inválidos. Inténtalo nuevamente.</div>');
    }
  });

  if ($('#balance').length) {
    $('#balance').text(localStorage.getItem('saldo') || 0);
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

  $('#saldoActual').text(localStorage.getItem('saldo'));

  $('#btnRealizarDeposito').click(function() {
    var monto = parseFloat($('#montoDeposito').val());
    var saldoActual = parseFloat(localStorage.getItem('saldo'));

    if (!isNaN(monto) && monto > 0) {
      var nuevoSaldo = saldoActual + monto;
      localStorage.setItem('saldo', nuevoSaldo);

      var movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];
      movimientos.push({
        tipo: 'deposito',
        monto: monto
      });
      localStorage.setItem('movimientos', JSON.stringify(movimientos));

      $('#saldoActual').text(nuevoSaldo);
      $('#mensajeDeposito').html('Monto depositado: $' + monto);
      $('#alert-container').html('<div class="alert alert-success mt-3">Depósito realizado correctamente.</div>');

      setTimeout(function() {
        window.location.href = 'menu.html';
      }, 2000);
    } else {
      $('#alert-container').html('<div class="alert alert-danger mt-3">Ingrese un monto válido.</div>');
    }
  });

  $('#saldoEnvio').text(localStorage.getItem('saldo') || 0);

  $('#btnMostrarContacto').click(function() {
    $('#formContacto').show();
  });

  $('#btnCancelarContacto').click(function() {
    $('#formContacto').hide();
  });

  $('#btnGuardarContacto').click(function() {
    var nombre = $('#nombreContacto').val();
    var cbu = $('#cbuContacto').val();
    var alias = $('#aliasContacto').val();
    var banco = $('#bancoContacto').val();

    if (nombre === '' || cbu === '' || alias === '' || banco === '') {
      $('#alert-container').html('<div class="alert alert-danger mt-3">Complete todos los campos del contacto.</div>');
      return;
    }

    if (cbu.length < 6) {
      $('#alert-container').html('<div class="alert alert-danger mt-3">El CBU debe tener al menos 6 números.</div>');
      return;
    }

    var contactos = JSON.parse(localStorage.getItem('contactos')) || [];

    contactos.push({
      nombre: nombre,
      cbu: cbu,
      alias: alias,
      banco: banco
    });

    localStorage.setItem('contactos', JSON.stringify(contactos));

    $('#listaContactos').append('<option value="' + nombre + '">' + nombre + ' - ' + alias + '</option>');

    $('#nombreContacto').val('');
    $('#cbuContacto').val('');
    $('#aliasContacto').val('');
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

    $('#saldoEnvio').text(nuevoSaldo);
    $('#mensajeEnvio').html('Envío realizado correctamente a ' + contacto + ' por $' + monto);
    $('#alert-container').html('<div class="alert alert-success mt-3">Dinero enviado correctamente.</div>');
  });

  function mostrarUltimosMovimientos(filtro) {
    var movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];
    $('#listaMovimientos').empty();

    if (movimientos.length === 0) {
      $('#listaMovimientos').append('<li class="list-group-item">No hay movimientos registrados.</li>');
      return;
    }

    movimientos.forEach(function(movimiento) {
      if (filtro === 'todos' || movimiento.tipo === filtro) {
        $('#listaMovimientos').append('<li class="list-group-item">' + movimiento.tipo + ' - $' + movimiento.monto + '</li>');
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
    var alias = contacto.alias.toLowerCase();

    if (nombre.includes(textoBusqueda) || alias.includes(textoBusqueda)) {
      $('#listaContactos').append(
        '<option value="' + contacto.nombre + '">' + contacto.nombre + ' - ' + contacto.alias + '</option>'
      );
    }
  });
});

});