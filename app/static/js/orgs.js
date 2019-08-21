function displayOrganisms(arrOrganisms) {
    for (o = 0; o < arrOrganisms.length; o++) {
        c = arrOrganisms[o];
        if (c.sound) {
            sound_text = "<span class='green'><i class='fa fa-check' aria-hidden='true'></i> Yes</span>";
        } else {
            sound_text = "<span class='red'><i class='fa fa-times' aria-hidden='true'></i> No</span>";
        }
        row = "<tr data-toggle='modal' data-target='#orgModal' data-id='" + c.id + "'>"
        row += "<th scope='row'>" + c.id + "</th>";
        for(t=1; t < table.length; t++) {
            if(c[table[t]] === 1) {
                row += "<td><span class='green'><i class='fa fa-check' aria-hidden='true'></i> Yes</span></td>";
            } else if(c[table[t]] === 0) {
                row += "<td><span class='red'><i class='fa fa-times' aria-hidden='true'></i> No</span></td>";
            } else if(table[t] !== "description") {
                row += "<td>" + c[table[t]] + "</td>";
            }
        }
        row += "</tr>";
        $("#dataTable tbody").append(row);

        $("#showGrid .row:nth-child(2)").append("<div class='col-sm-6 col-md-4'>" +
                "<div class='thumbnail org-card' data-id='" + c.id + "'>" +
                    "<img alt='" + c.name + "' src='" + PATH_IMAGES + c.id + ".jpg' onError='imgError(this);'>" +
                    "<div class='caption'>" +
                        "<h3>" + c.name + "</h3>" +
                        "<h4><i>" + c.scientific_name + "</i></h4>" +
                        "<p>" +
                            "<a href='#' role='button' class='btn btn-primary' data-toggle='modal' data-target='#orgModal' data-id='" + c.id + "'>View details »</a>" +
                        "</p>" +
                    "</div>" +
                "</div>" +
            "</div>");
    }
    // https://stackoverflow.com/questions/31888566/bootstrap-how-to-sort-table-columns
    $('#dataTable').dataTable({
        "pageLength": 100
    });
}

$("#bShowGrid").click(function() {
    $("#bShowGrid").parent().addClass("active");
    $("#bShowList").parent().removeClass("active");
    $("#showGrid").removeClass('hide');
    $("#showList").addClass('hide');
});
$("#bShowList").click(function() {
    $("#bShowGrid").parent().removeClass("active");
    $("#bShowList").parent().addClass("active");
    $("#showGrid").addClass('hide');
    $("#showList").removeClass('hide');
});

$('#orgModal').on('show.bs.modal', function(event) {
    $('#back-to-top').css("z-index", "-1");
    var button = $(event.relatedTarget);
    try {
        var id = button.data('id');
    } catch(e) {
        var id = $(event.target).parent().data("id");
    }
    var modal = $(this);
    data = $.grep(orgs, function(e){ return e.id === id; })[0];
    if(DB_NAME == "birds" && data.id == 74) {
        modal.find('.img-thumbnail').attr("src", PATH_IMAGES + data.id + ".winter.jpg");
        modal.find('.copyright').html("Photo by <a href='http://www.eneija.com/' target='_blank'>Eneija</a>")
    } else {
        modal.find('.img-thumbnail').attr("src", PATH_IMAGES + data.id + ".jpg");
        modal.find('.copyright').text("All media belongs to their respective owner(s).")
    }
    modal.find('.img-thumbnail').attr("onError", "imgError(this);");
    modal.find('.modal-title').text(data.name);
    modal.find('.family').text(data.family);
    modal.find('.id').text(data.id);
    modal.find('.scientific_name').text(data.scientific_name);
    if(data.description !== null) {
        modal.find('.modal-description').html(data.description.split("\\n").join("<br />"));
    } else {
        modal.find('.modal-description').text("No description. Sorry!");
    }
    if(data.sound) {
        modal.find('.audio_clip').html("<audio controls>" +
            "<source src='" + PATH_AUDIO + data.id + ".mp3' type='audio/mpeg'>" +
            "<source src='" + PATH_AUDIO + data.id + ".ogg' type='audio/ogg'>" +
            "Your browser does not support the audio element." +
            "</audio>");
    } else {
        modal.find('.audio_clip').empty();
    }
    $(".modal .fade").addClass("in");
});

$('#orgModal').on('hide.bs.modal', function(event) {
    $('#back-to-top').css("z-index", "");
    if (scrollTop > scrollTrigger) {
        $('#back-to-top').addClass('show');
    } else {
        $('#back-to-top').removeClass('show');
    }
    $('audio').trigger("pause");
    $(".modal .fade").removeClass("in");
});

$('#orgModal').on('hidden.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    try {
        var id = button.data('id');
    } catch(e) {
        var id = $(event.target).parent().data("id");
    }
    var modal = $(this);
    modal.find('.img-thumbnail').attr("src", "");
})

// TODO: Use dataTable's search()
$("#inputGrid").on('keyup click', function(event) {
    value = event.target.value;
    value = cleanText(value);
    if(value !== "") {
        $(".caption").parent().parent().css("display", "none");
        $(".caption:contains('" + value + "')").parent().parent().css("display", "inline");
    } else {
        $(".caption").parent().parent().css("display", "inline");
    }
})

// $('.clearable').trigger("input");
// Uncomment the line above if you pre-fill values from LS or server


// if (window.history && window.history.pushState) {
//     $('#orgModal').on('show.bs.modal', function (e) {
//         window.history.pushState('forward', null, './#modal');
//     });
//
//     $(window).on('popstate', function () {
//         $('#orgModal').modal('hide');
//     });
// }

// Immutable hash state identifiers.
// var closedModalHashStateId = "#modalClosed";
// var openModalHashStateId = "#modalOpen";
//
// window.location.hash = closedModalHashStateId;
//
// $('#orgModal').on('show.bs.modal', function(e) {
// window.location.hash = openModalHashStateId;
// });
//
// $('#orgModal').on('hide.bs.modal', function(e) {
// window.history.back();
// });
