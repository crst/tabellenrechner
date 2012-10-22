var TBL = {};


$(document).ready(function () {
  TBL.maxDays = Object.keys(TBL.matchdays).length;

  // Create container div's.
  TBL.renderUI();

  // Create matchday div and table.
  TBL.init();
  $('#tbl-reset').click(TBL.init);


  // Events for changing the viewed matchday.
  $('#tbl-next').click(function () {
    if (TBL.displayDay < TBL.maxDays) {
      TBL.displayDay += 1;
      TBL.displayMatchday(TBL.displayDay);
    }
  });

  $('#tbl-prev').click(function () {
    if (TBL.displayDay > 1) {
      TBL.displayDay -= 1;
      TBL.displayMatchday(TBL.displayDay);
    }
  });

  $('#tbl-md-select').change(function () {
    TBL.displayDay = parseInt($(this).attr('value'), 10);
    TBL.displayMatchday(TBL.displayDay);
  });
});


TBL.init = function () {
  // Copy the fixture list, so that we can load it again on reset.
  TBL.matches = $.extend(true, {}, TBL.matchdays);

  // Display the current matchday.
  TBL.displayDay = TBL.currentMatchday;
  TBL.displayMatchday(TBL.displayDay);
  TBL.buildTable();
};


TBL.displayMatchday = function (day) {
  $('#tbl-prev').css('visibility', day === 1 ? 'hidden' : 'visible');
  $('#tbl-next').css('visibility', day === TBL.maxDays ? 'hidden' : 'visible');
  $('#tbl-md-select option[value="' + day + '"]').prop('selected', true);

  TBL.renderMatchday(day);
  $('#tbl-matchday').animate({opacity: 1}, 'slow');
  TBL.bindEvents(day);
};


TBL.bindEvents = function (day) {
  // Highlight the table entries of the teams from a match when hovered.
  $('#tbl-matchday tr').hover(function () { TBL.highlightTeams($(this), true); },
                              function () { TBL.highlightTeams($(this), false); });

  // Modify the number of goals when the name of a team is clicked.
  $('.tbl-goal').bind('click contextmenu', function (event) {
    event.preventDefault();

    // Get the match/team that was clicked.
    var matchId = $(this).parents('tr').attr('data-match-id');
    var match = TBL.matches[day][matchId];
    var team = $(this).attr('data-home') === 'true' ? 'homeGoals' : 'awayGoals';

    // Validate and parse the input.
    TBL.validateMatch(day, matchId);
    var inp = $('input[id=tbl-' + $(this).attr('data-team') + ']');
    var goals = parseInt(inp.val(), 10);
    // Change the number of goals.
    if (event.which === 3) {
      if (goals > 0) {
        goals -= 1;
      } else if (match.homeGoals === match.awayGoals) {
        goals = undefined;
        TBL.clearMatch(day, matchId);
      }
    } else {
      goals += 1;
    }
    TBL.matches[day][matchId][team] = goals;
    inp.val(goals);

    // Rebuild the table.
    TBL.buildTable(day);
    TBL.highlightTeams($(this).parents('tr'), true);
  });

  // Whenever a number is entered directly, recalculate the table.
  $('input').bind('keyup mouseup change', function () {
    var row = $(this).parents('tr');
    TBL.validateMatch(day, row.attr('data-match-id'));
    TBL.buildTable(day);
    TBL.highlightTeams(row, true);
  });

  // Remove the result of the corresponding match.
  $('a[id^=tbl-clear-]').click(function () {
    TBL.clearMatch(day, $(this).parents('tr').attr('data-match-id'));
  });
};


TBL.clearMatch = function (day, matchId) {
  // Remove the result of the match.
  TBL.matches[day][matchId].homeGoals = undefined;
  TBL.matches[day][matchId].awayGoals = undefined;
  var row = $('tr[data-match-id="' + matchId + '"]');
  row.find('input').val('');

  // Rebuild the table.
  TBL.buildTable(day);
  TBL.highlightTeams(row, true);
};


TBL.highlightTeams = function (match, status) {
  // Find the table rows of the teams from the match and add or remove
  // the highlighting class.
  match.find('a[data-team]').map(function () {
    var team = $('#tbl-rank-' + $(this).attr('data-team'));
    if (status) { team.addClass('tbl-highlight-row'); }
    else { team.removeClass('tbl-highlight-row'); }
  });
};


TBL.validateMatch = function (day, matchId) {
  // Check if the input fields for the match contain numbers.
  $('tr[data-match-id="' + matchId + '"] input').map(function () {
    var val = parseInt($(this).val(), 10);
    if (isNaN(val) || val < 0) { val = 0; }
    var team = $(this).attr('data-home') === 'true' ? 'homeGoals' : 'awayGoals';
    TBL.matches[day][matchId][team] = val;
    $(this).val(val);
  });
};


// Recalculate and display the table.
TBL.buildTable = function () {
  // Get all teams.
  var data = {}, nr;
  for (nr in TBL.teams) { if (TBL.teams.hasOwnProperty(nr)) {
    data[nr] = {'matches': 0, 'points': 0, 'for': 0, 'against': 0};
  }}

  // Collect all results.
  for (var i = 1; i <= TBL.maxDays; i++) {
    for (var j = 0; j < TBL.matches[i].length; j++) {
      var m = TBL.matches[i][j];

      if (m.homeGoals !== undefined) {
        data[m.home].matches += 1;
        data[m.away].matches += 1;

        if (m.homeGoals > m.awayGoals) {
          data[m.home].points += TBL.POINTS_WIN;
        } else if (m.homeGoals === m.awayGoals) {
          data[m.home].points += TBL.POINTS_DRAW;
          data[m.away].points += TBL.POINTS_DRAW;
        } else {
          data[m.away].points += TBL.POINTS_WIN;
        }

        data[m.home]['for'] += m.homeGoals;
        data[m.home].against += m.awayGoals;
        data[m.away]['for'] += m.awayGoals;
        data[m.away].against += m.homeGoals;
      }
    }
  }

  // Convert dictionary to a list, to allow sorting.
  var tbl = [];
  for (nr in data) { if (data.hasOwnProperty(nr)) {
    tbl.push([TBL.teams[nr], data[nr].matches, data[nr].points, data[nr]['for'], data[nr].against, nr]);
  }}
  // Display the table.
  TBL.renderTable(tbl.sort(TBL.compareTeams));
};


TBL.compareTeams = function (a, b) {
  if (a[2] !== b[2]) { return b[2] - a[2]; } // Compare points
  var diff = (b[3] - b[4]) - (a[3] - a[4]); // Goal difference
  return diff !== 0 ? diff : b[3] - a[3];  // Compare goal difference or goals
};


TBL.match = function (home, away, homeGoals, awayGoals) {
  return {home: home, away: away, homeGoals: homeGoals, awayGoals: awayGoals};
};


/***** UI 'templates' *****/

TBL.renderUI = function () {
  var html = ['<div id="tbl-nav">',
              '<a id="tbl-prev" href="javascript:void(0);">&lsaquo;</a>',
              '<div id="tbl-caption">',
              '<form>',
              '<select id="tbl-md-select" size="1">'];
  for (var i = 1; i <= TBL.maxDays; i++) {
    html.push('<option value="' + i + '">' + TBL._.matchday + ' ' + i + '</option>');
  }
  html.push.apply(
    html,
    ['</select>',
     '</div>',
     '<a id="tbl-next" href="javascript:void(0);">&rsaquo;</a>',
     '</div>',
     '<div id="tbl-reset">',
     '<a href="javascript:void(0);" id="tbl-reset">',
     TBL._.reset,
     '</a></div>',
     '<div id="tbl-matches" class="matchday"></div>',
     '<div id="tbl-ranking"></div>']
  );
  $('#tbl-container').append(html.join(''));
};


TBL.renderMatchday = function (day) {
  var html = ['<form id="tbl-matchday"><table>'];
  var curMatch, home, hg, away, ag;
  for (var i = 0; i < TBL.matches[day].length; i++) {
    curMatch = TBL.matches[day][i];
    home = curMatch.home;
    away = curMatch.away;
    hg = curMatch.homeGoals !== undefined ? curMatch.homeGoals : '';
    ag = curMatch.awayGoals !== undefined ? curMatch.awayGoals : '';
    html.push.apply(
      html,
      ['<tr data-match-id="' + i + '">',
       '<td>',
       '<a href="javascript:void(0);" ',
       'class="tbl-goal" data-team="' + home + '" data-home="true">' + TBL.teams[home] + '</a>',
       '</td>',
       '<td class="tbl-sep">-</td>',
       '<td>',
       '<a href="javascript:void(0);" ',
       'class="tbl-goal" data-team="' + away + '" data-home="false">' + TBL.teams[away] + '</a>',
       '</td>',
       '<td>',
       '<input id="tbl-' + home + '" type="text" maxlength="2" value="' + hg + '" data-home="true">',
       '</td>',
       '<td class="tbl-sep">:</td>',
       '<td>',
       '<input id="tbl-' + away + '" type="text" maxlength="2" value="' + ag + '" data-home="false">',
       '</td>',
       '<td class="tbl-clear">',
       '<a id="tbl-clear-' + i + '" href="javascript:void(0);"><b>x</b></a>',
       '</td>',
       '</tr>']
    );
  }
  html.push('</table></form>');

  $('#tbl-matches').html(html.join(''));
};


TBL.renderTable = function (tbl) {
  var html = ['<table id="tbl-ranks"><thead><tr>',
              '<th>' + TBL._.rank + '</th>',
              '<th>' + TBL._.team + '</th>',
              '<th>' + TBL._.matches + '</th>',
              '<th>' + TBL._.points + '</th>',
              '<th>' + TBL._.goals + '</th>',
              '<th>' + TBL._.diff + '</th>',
              '</tr></thead><tbody>'];

  var cls, rank = 1;
  for (var i = 0; i < tbl.length; i++) {
    cls = $.inArray(tbl[i][0], TBL.highlight) >= 0 ? 'tbl-highlight-team' : '';

    if (i > 0 && TBL.compareTeams(tbl[i - 1], tbl[i]) !== 0) {
      rank = i + 1;
    }

    html.push.apply(
      html,
      ['<tr id="tbl-rank-' + tbl[i][5] + '" class="' + cls + '">',
       '<td>' + rank + '. ' + '</td>',
       '<td>' + tbl[i][0] + '</td>',
       '<td>' + tbl[i][1] + '</td>',
       '<td>' + tbl[i][2] + '</td>',
       '<td>' + tbl[i][3] + ':' + tbl[i][4] + '</td>',
       '<td>' + (tbl[i][3] - tbl[i][4]) + '</td>',
       '</tr>']
    );
  }
  html.push('</tbody></table>');

  $('#tbl-ranking').html(html.join(''));
};
