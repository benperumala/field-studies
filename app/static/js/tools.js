function imgError(image) {
    image.onerror = "";
    image.src = "data:image/jpeg;base64,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";
    return true;
}

function cleanText(text) {
    newText = text.trim().replace(/ /g," ").toLowerCase();
    return newText;
}

function tog(v){return v?'addClass':'removeClass';}
$(document).on('input', '.clearable', function() {
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function(e) {
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function(ev) {
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
    $('#dataTable').dataTable().fnFilter('');
});

if ($('#back-to-top').length) {
    window.scrollTrigger = 100, // px
        backToTop = function () {
            window.scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $('#back-to-top').addClass('show');
            } else {
                $('#back-to-top').removeClass('show');
            }
        };
    backToTop();
    $(window).on('scroll', function () {
        backToTop();
    });
    $('#back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });
}

function nbci() {
    url = "https://www.ncbi.nlm.nih.gov/pmc/?term=";
    query = prompt("What would you like to search?");
    if(query != null) {
        query = query.trim().replace(/ /g,"+");
        window.open(url + query,'_blank');
    } else {
        alert("Can't look up nothing.")
    }
}

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}
