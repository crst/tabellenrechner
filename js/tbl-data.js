// Example configuration file.


// The current matchday that will be displayed when the script is
// loaded.
TBL.currentMatchday = 3;


// Teams of the league, format: {'short_name': 'displayed_name'}
TBL.teams = {
  'real': 'Real Club de Fútbol',
  'cfc' : 'City Football Club',
  'fc'  : 'Fußball Club',
  'ac'  : 'Associazione Calcio'
};


// Highlight some of the teams (as defined by the class
// '.tbl-highlight-team' from the stylesheet). List can also be empty
// if no team should be highlighted.
TBL.highlight = [TBL.teams.cfc];


// The fixture list of the league. First two matchdays with results.
TBL.matchdays = {
  1: [TBL.match('ac', 'cfc', 2, 1),
      TBL.match('fc', 'real', 0, 2)],
  2: [TBL.match('real', 'ac', 5, 2),
      TBL.match('cfc', 'fc', 3, 3)],
  3: [TBL.match('fc', 'ac'),
      TBL.match('real', 'cfc')],
  4: [TBL.match('cfc', 'real'),
      TBL.match('ac', 'fc')],
  5: [TBL.match('cfc', 'ac'),
      TBL.match('real', 'fc')],
  6: [TBL.match('fc', 'cfc'),
      TBL.match('ac', 'real')]
};


// Displayed text, can be changed for other languages.
TBL._ = {
  matchday: 'Jornada',
  reset   : 'Reset',
  rank    : '',
  team    : 'Equipo',
  matches : 'Jugados',
  points  : 'Puntos',
  goals   : 'Goles',
  diff    : 'Diferencia'
};


TBL.POINTS_WIN = 3;
TBL.POINTS_DRAW = 1;
