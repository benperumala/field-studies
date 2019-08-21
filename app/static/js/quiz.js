function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function quizOptions(orgArrayMain, orgsCorrect) {
    choices = genQuizOptions(orgArrayMain, orgsCorrect);
    displayQuizOptions(choices);
}

function orgGetRandom(arrOrg) {
    orgRandom = arrOrg[Math.floor(Math.random() * arrOrg.length)];
    return orgRandom;
}

function orgsWithSound(arrOrg) {
    sounds = arrOrg.filter(function(obj) {
        return obj.sound == 1;
    });
    return sounds;
}

function orgsImportant(arrOrg) {
    important = arrOrg.filter(function(obj) {
        return obj.smaller_list == 1;
    });
    return important;
}

function genQuizOptions(arrOrgs, arrOrgsDone) {
    options = [];
    tries = 0;
    while(options.length < 4 && tries < 25) {
        tries += 1;
        orgRand = orgGetRandom(arrOrgs);
        if($.inArray(orgRand.id, arrOrgsDone) == -1 &&
           $.inArray(orgRand, options) == -1) {
                options.push(orgRand);
        } else {
            console.debug(orgRand.id + " rejected")
        }
    }
    return options;
}

function quizOptionsNew() {
    if($("#onlySounds").is(':checked')) {
        quizOptions(orgsWithSound(orgs), orgsCorrect);
    } else {
        quizOptions(orgs, orgsCorrect);
    }
}

function spellingShow() {
    $("#spelling-button").show();
}

function spellingHide() {
    $("#spelling-button").hide();
    $("#spelling-debug").hide();
}

var orgCorrect = {id: -1};
var prevOrgCorrect = {id: -1};
function displayQuizOptions(arrOrgs) {
    prevOrgCorrect = orgCorrect;
    do {
        // console.debug("Generating new correct answer...")
        correct = getRandomIntInclusive(0, 3);
        orgCorrect = arrOrgs[correct];
        Math.seedrandom(orgCorrect.scientific_name + Math.random().toString(),
                        { entropy: true });

        // console.debug(orgCorrect)
        // console.debug("prev: " + prevOrgCorrect.id + " curr: " + orgCorrect.id);
        // if(orgCorrect.id == prevOrgCorrect.id) { alert("true") };
    } while(orgCorrect.id == prevOrgCorrect.id);

    $(".quiz-option").attr("data-id", "");
    for(id=0; id < 4; id++) {
        cOrg = arrOrgs[id];
        if(id == correct) {
            $("." + id).attr("data-id", cOrg.id);
        }
        $("." + id).text(cOrg.name);
    }

    if(DB_NAME == "birds" && orgCorrect.id == 74) {
        $("#picture").attr("src", PATH_IMAGES + orgCorrect.id + ".winter.jpg");
    } else {
        $("#picture").attr("src", PATH_IMAGES + orgCorrect.id + ".jpg");
    }
    if(orgCorrect.sound) {
        audio = $("#audio audio");
        $("source.mp3").attr("src", PATH_AUDIO + orgCorrect.id + ".mp3");
        $("source.ogg").attr("src", PATH_AUDIO + orgCorrect.id + ".ogg");
        audio[0].load(); // Make sure the audio player loads the file
        $("#audio").show();
    } else {
        $("#audio").hide();
    }
    if(orgCorrect.description) {
        $(".description").html(orgCorrect.description.split("\\n").join("<br />"));
    } else {
        $(".description").text("No available description. Sorry!");
    }
}

var mainOrgArray;
var orgsCorrect = [];
// Show orgs with calls only
$("#onlySounds").click(function() {
    // Reset org checker
    orgsCorrect = [];

    if($(this).is(':checked')) {
        var mainOrgArray = orgsWithSound(orgs);
    } else {
        var mainOrgArray = orgs;
    }
    // console.debug(orgArrayMain);

    quizOptions(mainOrgArray, orgsCorrect);
});

$("#onlyImportant").click(function() {
    // Reset org checker
    orgsCorrect = [];

    if($(this).is(':checked')) {
        var mainOrgArray = orgsImportant(orgs);
    } else {
        var mainOrgArray = orgs;
    }
    // console.debug(orgArrayMain);

    quizOptions(mainOrgArray, orgsCorrect);
});

$("#noThumbnail").click(function() {
    if($(this).is(':checked')) {
        $("#picture").hide();
    } else {
        $("#picture").show();
    }
});

$("#showDescription").click(function() {
    if($(this).is(":checked")) {
        $(".description").hide();
    } else {
        $(".description").show();
    }
});

$("#onlySpelling").click(function() {
    if($(this).is(':checked')) {
        $(".multiple-choice").hide();
        $(".single-choice").show();
        $("#spelling").focus();
    } else {
        $(".multiple-choice").show();
        $(".single-choice").hide();
    }
});


var firstTry = true;
function resetOptions() {
    window.firstTry = true;
    $(".input-group-btn button").removeClass("btn-danger btn-success").addClass("btn-primary");
    $(".input-group").removeClass("has-error has-success");
    $('#spelling').val('');
    $(".quiz-option").removeClass("btn-danger btn-success").addClass("btn-primary");
}

var allowQuiz = 1;
var correctAnswer = 0;
$("form").submit(function(event) {
    event.preventDefault();
    if(allowQuiz) {
        spelling_quiz = cleanText($("#spelling").val());
        if(orgCorrect.name.indexOf("(") > -1) {
            arr_corr = orgCorrect.name.toLowerCase().split("(");
            arr_corr[1] = arr_corr[1].match(/(.*).$/)[1];
            $.map(arr_corr, $.trim);
        } else {
            arr_corr = [orgCorrect.name.toLowerCase()];
        }

        console.debug("--------------------------------------");
        window.correctAnswer = 0;
        for(x=0; x < arr_corr.length; x++) {
            spelling_correct = cleanText(arr_corr[x]);
            condition = (spelling_quiz == spelling_correct);
            console.debug("\"" + spelling_quiz + "\" == \"" + spelling_correct + "\" (" + condition + ")");
            if (spelling_quiz == spelling_correct) {
                window.correctAnswer = 1;
            }
        }
        if(window.correctAnswer) {
            $(".input-group-btn button").removeClass("btn-primary btn-danger").addClass("btn-success");
            $(".input-group").removeClass("has-error").addClass("has-success");
            window.allowQuiz = 0;
            window.setTimeout(function() {
                spellingHide();
                resetOptions();
                quizOptionsNew();
                window.allowQuiz = 1;
            }, 1000);
        } else {
            $(".input-group-btn button").removeClass("btn-primary").addClass("btn-danger");
            $(".input-group").addClass("has-error");
            diffDebug = "";
            if(arr_corr.length > 1) {
                for(x=0; x < arr_corr.length; x++) {
                    spelling_correct = cleanText(arr_corr[x]);
                    diffDebug += diffString(spelling_quiz, spelling_correct);
                    diffDebug += " OR ";
                }
            } else {
                diffDebug = diffString(spelling_quiz, arr_corr[0]);
            }
            window.diffDebug = diffDebug;
            if(diffDebug.endsWith("OR ")) {
                diffDebug = diffDebug.slice(0, -1).replace(/\w+[.!?]?$/, "");
            }
            $("#spelling-debug").html(diffDebug);
            spellingShow();
        }
    }
});

$(".quiz-option").click(function() {
    dataID = $(this).attr('data-id');
    if(dataID) {
        if(window.firstTry) {
            window.orgsCorrect.push(parseInt(dataID))
        }
        $('audio').trigger("pause");
        $("audio").prop("currentTime", 0);
        $(this).removeClass("btn-primary").addClass("btn-success");
        window.setTimeout(function() {
            resetOptions();
            quizOptionsNew();
            }, 1000);
    } else {
        window.firstTry = false;
        $(this).removeClass("btn-primary").addClass("btn-danger");
    }
});
