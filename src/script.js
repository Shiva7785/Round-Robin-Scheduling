$(document).ready(function () {
    recalculateServiceTime();
    $('#minus').hide();

    $(".initial").change(function () {
        recalculateServiceTime();
    });
});

function addRow() {
    var lastRow = $('#inputTable tr:last');
    var lastRowNumber = parseInt(lastRow.children()[0].innerText.substring(1));

    var newRow = '<tr><td>P' + (lastRowNumber + 1) + '</td>' +
        '<td><input class="initial arrivaltime" type="text"/></td>' +
        '<td><input class="initial exectime" type="text"/></td>' +
        '<td class="servtime"></td></tr>';

    lastRow.after(newRow);

    $('#minus').show();

    $('#inputTable tr:last input').change(function () {
        recalculateServiceTime();
    });
}

function deleteRow() {
    var lastRow = $('#inputTable tr:last');
    if (lastRow.index() > 0) {
        lastRow.remove();
        recalculateServiceTime();
        if ($('#inputTable tr').length <= 2) {
            $('#minus').hide();
        }
    }
}

function recalculateServiceTime() {
    var inputTable = $('#inputTable tr');
    var totalExecuteTime = 0;

    var quantum = parseInt($('#quantum').val());
    var remainingTimes = [];
    var arrivalTimes = [];

    $.each(inputTable, function (key, value) {
        if (key == 0) return true;
        var executeTime = parseInt($(value.children[2]).children().first().val());
        remainingTimes.push(executeTime);
        arrivalTimes.push(parseInt($(value.children[1]).children().first().val()));
    });

    var time = 0;
    var done = false;
    while (!done) {
        done = true;
        for (let index = 1; index < inputTable.length; index++) {
            if (remainingTimes[index - 1] > 0 && arrivalTimes[index - 1] <= time) {
                done = false;
                if (remainingTimes[index - 1] > quantum) {
                    time += quantum;
                    remainingTimes[index - 1] -= quantum;
                } else {
                    time += remainingTimes[index - 1];
                    remainingTimes[index - 1] = 0;
                }
                $(inputTable.eq(index).children()[3]).text(time);
            }
        }
    }
}

function draw() {
    $('#fresh').html('');
    var inputTable = $('#inputTable tr');
    var th = '';
    var td = '';
    var quantum = parseInt($('#quantum').val());

    var processTimes = [];
    $.each(inputTable, function (key, value) {
        if (key == 0) return true;
        var executeTime = parseInt($(value.children[2]).children().first().val());
        processTimes.push({ index: key - 1, time: executeTime });
    });

    var time = 0;
    var done = false;
    while (!done) {
        done = true;
        $.each(processTimes, function (i, process) {
            if (process.time > 0) {
                done = false;
                var execTime = Math.min(quantum, process.time);
                process.time -= execTime;
                th += '<th style="height: 60px; width: ' + execTime * 20 + 'px;">P' + process.index + '</th>';
                td += '<td>' + execTime + '</td>';
                time += execTime;
            }
        });
    }

    $('#fresh').html('<table id="resultTable"><tr>' + th + '</tr><tr>' + td + '</tr></table>');

    animate(time);
}

function animate(sum) {
    $('#fresh').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
    $('#curtain').width($('#resultTable').width());
    $('#curtain').css({ left: $('#resultTable').position().left });

    animationStep(sum, 0);
    jQuery('#curtain').animate({ width: '0', marginLeft: $('#curtain').css("width") }, sum * 1000 / 2, 'linear');
}

function animationStep(steps, cur) {
    $('#timer').html(cur);
    if (cur < steps) {
        setTimeout(function () {
            animationStep(steps, cur + 1);
        }, 500);
    }
}
