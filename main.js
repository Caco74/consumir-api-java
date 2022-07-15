$(document).ready(() => {

    // Listado de alumnos
    const list = () => {
        $.ajax({
            url: 'https://api-alumnos.herokuapp.com/api/list',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                let data = '';
                response.forEach(element => {
                    data+= `
                    <tr alumnoId = ${element.id}>
                        <td>${element.id}</td>
                        <td>${element.apellido}</td>
                        <td>${element.curso}</td>
                        <td>${element.nota}</td>

                        <td>
                            <button id="btn-details" class="btn btn-warning">Detalles</button>
                        </td>
                        <td>
                            <button id="btn-delete" class="btn btn-danger">Eliminar</button>
                        </td>
                        <td>
                            <button id="btn-edit" class="btn btn-success">Editar</button>
                        </td>
                    </tr>
                    `
                });
    
                $('#tbody').html(data);
            }
        })
    }

    // Guardado de alumnos
    const save = () => {
        $('#agregar').on('click', function () {
            const datosAlumno = {
                apellido: $('#apellido').val(),
                curso: $('#curso').val(),
                nota: $('#nota').val()
            }

            $.ajax({
                url: 'https://api-alumnos.herokuapp.com/api/save',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(datosAlumno),
                success: () => {
                    $('#messages').html('Alumno Creado!').css('display', 'block')
                    list();
                    reset();
                    console.log('Alumno registrado!');
                }

            })
        })
    }

    // Detalles del alumno
    const details = () => {
        $(document).on('click', '#btn-details', function() {
            let btnDetails = $(this)[0].parentElement.parentElement;
            let id = $(btnDetails).attr('alumnoId');
            
            $.ajax({
                url: 'https://api-alumnos.herokuapp.com/api/alumno/'+id,
                type: 'GET',
                dataType: 'json',
                success: (res) => {
                    let data = `
                     <strong>Apellido</strong>: ${res.apellido}

                     <br><strong>Curso</strong>   : ${res.curso}
                     <br><strong>Nota</strong>    :  ${res.nota}
                     <br><br><button id="btn-limpiar" class="btn btn-warning">Limpiar</button>
                    `
                    let alumno = $('#alumno-details').html(data);
                    $('#btn-limpiar').on('click', () =>  {
                        alumno.html('');
                    })
                }
            })
        })
    }

    // Eliminar alumno
    const deleteAlumno = () => {
        $(document).on('click', '#btn-delete', function() {
            if (confirm('Seguro de eliminar?')) {
                let btnDelete = $(this)[0].parentElement.parentElement;
                let id = $(btnDelete).attr('alumnoId');
    
                $.ajax({
                    url: 'https://api-alumnos.herokuapp.com/api/delete/'+id,
                    type: 'DELETE',
                    dataType: 'json',
                    success: (res) => {
                        $('#messages').html('Alumno Eliminado').css('display', 'block');
                        list();
                    }
                })
            }

        })
    }

    // Rellenar los datos del alumno en el formulario
    const rellenarAlumno = () => {
        $(document).on('click', '#btn-edit', function() {
            let btnEdit = $(this)[0].parentElement.parentElement;
            let id = $(btnEdit).attr('alumnoId');

            $('#agregar').hide();
            $('#editar').show();

            $.ajax({
                url: 'https://api-alumnos.herokuapp.com/api/alumno/' +id,
                type: 'GET',
                dataType: 'json',
                success: (res) => {
                    $('#id').val(res.id);
                    $('#apellido').val(res.apellido);
                    $('#curso').val(res.curso);
                    $('#nota').val(res.nota);
                }
            })
        })
    }

    // Editar los datos del alumno
    const editAlumno = () => {
        $('#editar').on('click', function() {
            let id = $('#id').val();
            //console.log(id);
            $('#agregar').css('display', 'none');
            $('#editar').css('display', 'block');
            const datosAlumno = {
                apellido: $('#apellido').val(),
                curso: $('#curso').val(),
                nota: $('#nota').val()
            }

            $.ajax({ 
                url: 'https://api-alumnos.herokuapp.com/api/update/'+id,
                contentType: 'application/json',
                type: 'PUT',
                data: JSON.stringify(datosAlumno),
                dataType: 'json',
                success: (res) => {
                    $('#messages').html('Alumno Modificado').css('display', 'block');
                    $('#editar').css('display', 'none')
                    $('#agregar').css('display', 'block');

                    reset();
                    list();
                }
            })
        })

    }

    // Método para limpiear el formulario
    const reset = () => {
        $('#apellido').val('');
        $('#curso').val('');
        $('#nota').val('');
    }

    // Llamadas a funciones
    list();
    save();
    details();
    deleteAlumno();
    rellenarAlumno();
    editAlumno();

})