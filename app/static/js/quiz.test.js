/*
    Util functions
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Quiz {
    constructor(arrOrgs) {
        this.orgs = arrOrgs;
        this.current_orgs = this.prepareOrgs(arrOrgs);
    }

    prepareOrgs(arrOrgs) {
        var temp = [];
        for (var x = 0; x < arrOrgs.length; x++) {
            temp.push([arrOrgs[x], 10]);
        }
        return temp;
    }

    getRandomOrg() {
        var fishForLevel = this.current_orgs;
        var fishTotalWeight = 0, fishCumWeight = 0, i;
        // sum up the weights
        for (i = 0; i < fishForLevel.length; i++) {
            fishTotalWeight += fishForLevel[i][2];
        }
        var random = Math.floor(Math.random() * fishTotalWeight);
        // now find which bucket out random value is in

        for (i = 0; i < fishForLevel.length; i++) {
            fishCumWeight += fishForLevel[i][2];
            if (random < fishCumWeight) {
                return(fishForLevel[i][0]);
            }
        }
    }

    orgsFilter(filter) {
        var _filter
        if(filter === undefined) {
            return this.orgs;
        } else {
            _filter = this.orgs.filter(function(obj) {
                return obj[filter] == 1;
            });
        }
    }

    orgsFilter(filter) {
        var _orgs = [];
        var _arr = [];
        if(filter) {
            _orgs = quiz.orgs.filter(function(obj) {
                return obj[filter] == 1;
            });
        } else {
            _orgs = quiz.orgs;
        }
        _orgs.forEach(function(element, index, array) {
            _arr.push([element, 10])
        })
        console.debug(_arr);
        quiz.current_orgs = _arr;
    }

    genQuizOptions() {
        var current;
        for(var x=0; x<4; x++) {
            current = this.getRandomOrg();
            console.debug(current);
            $(".quiz-option." + x).text(current);
        }
    }
}

/*
--------------------------------------------
                 EVENTS
--------------------------------------------
*/

$("#onlySounds").click(function() {
    if($(this).is(':checked')) {
        quiz.orgsFilter("sound");
    } else {
        quiz.orgsFilter();
    }
});

$("#onlySmallerList").click(function() {
    if($(this).is(':checked')) {
        quiz.orgsFilter("smaller_list");
    } else {
        quiz.orgsFilter();
    }
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
